const mongoose = require('mongoose');

class EasyMongoo {
  constructor() {
    this.connection = null;
    this.models = new Map();
    this.isConnected = false;
    this.debug = false;
    this.schemas = new Map();
  }

  // ==================== CONNECTION MANAGEMENT ====================

  async connect(uri, options = {}) {
    try {
      this.debug = options.debug || false;
      delete options.debug; // Remove debug from mongoose options

      const defaultOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...options
      };

      this._log('🔄 Connecting to MongoDB...');
      
      this.connection = await mongoose.connect(uri, defaultOptions);
      this.isConnected = true;
      
      // Enhanced connection events
      mongoose.connection.on('connected', () => {
        this._log('✅ MongoDB Connected Successfully!');
        this._log(`📊 Database: ${mongoose.connection.db.databaseName}`);
      });

      mongoose.connection.on('error', (err) => {
        this._error('❌ MongoDB Error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        this._log('🔌 MongoDB Disconnected');
        this.isConnected = false;
      });

      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      return this.connection;
    } catch (error) {
      this._error('❌ Connection Failed:', error.message);
      throw this._simplifyError(error);
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      this._log('🔌 MongoDB Disconnected');
    }
  }

  // ==================== COMPLETE SCHEMA SYSTEM ====================

  /**
   * ULTRA SMART SCHEMA - Handles everything automatically!
   */
  schema(definition, options = {}) {
    // Auto-convert easy syntax to full mongoose schema
    const processedDefinition = this._convertToFullSchema(definition);
    
    // Smart defaults
    const schemaOptions = {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // Auto timestamps
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      ...options
    };

    const schema = new mongoose.Schema(processedDefinition, schemaOptions);

    // Auto-add virtuals for common fields
    this._addCommonVirtuals(schema);
    
    return schema;
  }

  /**
   * Convert easy syntax to complete mongoose schema
   */
  _convertToFullSchema(definition) {
    const converted = {};

    for (const [field, config] of Object.entries(definition)) {
      if (typeof config === 'string') {
        converted[field] = this._parseSmartShortcut(config);
      } else if (Array.isArray(config)) {
        converted[field] = config;
      } else if (typeof config === 'object') {
        converted[field] = this._processFieldConfig(field, config);
      }
    }

    return converted;
  }

  /**
   * SMART SHORTCUTS - Handles everything!
   */
  _parseSmartShortcut(shortcut) {
    const shortcuts = {
      // ========== REQUIRED FIELDS ==========
      'string!': { type: String, required: [true, '{PATH} is required'] },
      'number!': { type: Number, required: [true, '{PATH} is required'] },
      'boolean!': { type: Boolean, required: [true, '{PATH} is required'] },
      'date!': { type: Date, required: [true, '{PATH} is required'] },
      'array!': { type: Array, required: [true, '{PATH} is required'] },
      'object!': { type: Object, required: [true, '{PATH} is required'] },
      
      // ========== OPTIONAL FIELDS ==========
      'string?': String,
      'number?': Number,
      'boolean?': Boolean,
      'date?': Date,
      'array?': Array,
      'object?': Object,
      
      // ========== WITH DEFAULTS ==========
      'string+': { type: String, default: '' },
      'number+': { type: Number, default: 0 },
      'boolean+': { type: Boolean, default: false },
      'date+': { type: Date, default: Date.now },
      'array+': { type: Array, default: [] },
      
      // ========== REQUIRED + UNIQUE ==========
      'string!!': { type: String, required: true, unique: true },
      'number!!': { type: Number, required: true, unique: true },
      
      // ========== BASIC TYPES ==========
      'string': String,
      'number': Number,
      'boolean': Boolean,
      'date': Date,
      'array': Array,
      'object': Object,
      'buffer': Buffer,

      // ========== EMAIL & URL SHORTCUTS ==========
      'email': { type: String, required: true, lowercase: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
      'url': { type: String, match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please enter a valid URL'] },
      'password': { type: String, required: true, minlength: 6 },
      
      // ========== ID REFERENCES ==========
      'userRef': { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      'postRef': { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      'productRef': { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    };

    return shortcuts[shortcut] || { type: String };
  }

  /**
   * Process field configuration with smart defaults
   */
  _processFieldConfig(fieldName, config) {
    const processed = { ...config };
    
    // Convert type string to mongoose type
    if (typeof processed.type === 'string') {
      processed.type = this._getMongooseType(processed.type);
    }
    
    // Auto-add enum validation message
    if (processed.enum && !processed.validate) {
      processed.validate = {
        validator: function(value) {
          return processed.enum.includes(value);
        },
        message: `{PATH} must be one of: ${processed.enum.join(', ')}`
      };
    }
    
    // Auto-add min/max messages
    if (processed.min && !processed.minlength) {
      processed.min = [processed.min, `{PATH} must be at least {MIN}`];
    }
    if (processed.max && !processed.maxlength) {
      processed.max = [processed.max, `{PATH} cannot exceed {MAX}`];
    }
    
    // Auto-lowercase emails
    if (fieldName.toLowerCase().includes('email')) {
      processed.lowercase = true;
      if (!processed.match) {
        processed.match = [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'];
      }
    }
    
    // Auto-trim strings
    if (processed.type === String && processed.trim === undefined) {
      processed.trim = true;
    }
    
    return processed;
  }

  /**
   * Add common virtuals to schema
   */
  _addCommonVirtuals(schema) {
    // Virtual for formatted createdAt
    schema.virtual('createdAtFormatted').get(function() {
      return this.createdAt?.toLocaleDateString();
    });
    
    // Virtual for age from birthdate
    if (schema.paths.birthDate || schema.paths.dob) {
      schema.virtual('age').get(function() {
        if (!this.birthDate && !this.dob) return null;
        const birth = this.birthDate || this.dob;
        return Math.floor((Date.now() - birth) / (365.25 * 24 * 60 * 60 * 1000));
      });
    }
    
    // Virtual for full name
    if (schema.paths.firstName && schema.paths.lastName) {
      schema.virtual('fullName').get(function() {
        return `${this.firstName} ${this.lastName}`.trim();
      }).set(function(name) {
        const parts = name.split(' ');
        this.firstName = parts[0] || '';
        this.lastName = parts.slice(1).join(' ') || '';
      });
    }
  }

  // ==================== COMPLETE MODEL SYSTEM ====================

  model(name, schemaDef, options = {}) {
    if (this.models.has(name)) {
      this._log(`📝 Using existing model '${name}'`);
      return this.models.get(name);
    }

    const schema = schemaDef instanceof mongoose.Schema ? schemaDef : this.schema(schemaDef, options);
    
    // Auto-add indexes for common fields
    this._addAutoIndexes(schema, schemaDef);
    
    // Auto-add middleware
    this._addAutoMiddleware(schema, name);
    
    const model = mongoose.model(name, schema);
    
    this.models.set(name, model);
    this.schemas.set(name, schema);
    
    this._log(`📝 Model '${name}' created with auto-features`);
    return model;
  }

  /**
   * Auto-add indexes for better performance
   */
  _addAutoIndexes(schema, definition) {
    // Index email fields
    if (definition.email) {
      schema.index({ email: 1 }, { unique: true, sparse: true });
    }
    
    // Index createdAt for sorting
    schema.index({ createdAt: -1 });
    
    // Index updatedAt
    schema.index({ updatedAt: -1 });
    
    // Index boolean fields that are commonly queried
    Object.keys(definition).forEach(field => {
      if (definition[field] === 'boolean!' || definition[field] === 'boolean?' || definition[field] === 'boolean+') {
        schema.index({ [field]: 1 });
      }
    });
  }

  /**
   * Auto-add useful middleware
   */
  _addAutoMiddleware(schema, modelName) {
    // Auto-slugify for name/title fields
    if (schema.paths.name || schema.paths.title) {
      schema.pre('save', function(next) {
        if (this.isModified('name') || this.isModified('title')) {
          const source = this.name || this.title;
          if (source && !this.slug) {
            this.slug = source.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          }
        }
        next();
      });
    }

    // Auto-hash password fields
    if (schema.paths.password) {
      schema.pre('save', async function(next) {
        if (!this.isModified('password')) return next();
        
        // Simple hash simulation (in real app, use bcrypt)
        this.password = `hashed_${this.password}_${Date.now()}`;
        next();
      });
    }

    // Log document changes in debug mode
    schema.post('save', (doc) => {
      this._log(`💾 ${modelName} saved:`, doc._id);
    });

    schema.post('remove', (doc) => {
      this._log(`🗑️ ${modelName} removed:`, doc._id);
    });
  }

  // ==================== COMPLETE CRUD WITH ALL OPTIONS ====================

  async create(modelName, data, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const doc = await Model.create(data);
      this._log(`✅ Created ${modelName}`);
      return doc;
    } catch (error) {
      throw this._handleError(`create ${modelName}`, error);
    }
  }

  async find(modelName, filter = {}, options = {}) {
    try {
      const Model = this._getModel(modelName);
      let query = Model.find(filter);

      // ALL Mongoose query options supported!
      if (options.select) query = query.select(options.select);
      if (options.sort) query = query.sort(options.sort);
      if (options.limit) query = query.limit(options.limit);
      if (options.skip) query = query.skip(options.skip);
      if (options.populate) query = query.populate(options.populate);
      if (options.lean) query = query.lean();
      if (options.collation) query = query.collation(options.collation);
      if (options.readPreference) query = query.read(options.readPreference);
      
      return await query.exec();
    } catch (error) {
      throw this._handleError(`find ${modelName}`, error);
    }
  }

  async findOne(modelName, filter = {}, options = {}) {
    try {
      const Model = this._getModel(modelName);
      let query = Model.findOne(filter);
      
      if (options.select) query = query.select(options.select);
      if (options.populate) query = query.populate(options.populate);
      if (options.lean) query = query.lean();
      if (options.sort) query = query.sort(options.sort);
      
      return await query.exec();
    } catch (error) {
      throw this._handleError(`find one ${modelName}`, error);
    }
  }

  async findById(modelName, id, options = {}) {
    try {
      const Model = this._getModel(modelName);
      let query = Model.findById(id);
      
      if (options.select) query = query.select(options.select);
      if (options.populate) query = query.populate(options.populate);
      if (options.lean) query = query.lean();
      
      const doc = await query.exec();
      if (!doc) this._log(`🔍 ${modelName} with ID ${id} not found`);
      return doc;
    } catch (error) {
      throw this._handleError(`find ${modelName} by ID`, error);
    }
  }

  async update(modelName, filter, data, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const updateOptions = {
        new: true,
        runValidators: true,
        context: 'query',
        ...options
      };

      const result = await Model.updateMany(filter, data, updateOptions);
      this._log(`✅ Updated ${result.modifiedCount} ${modelName} documents`);
      return result;
    } catch (error) {
      throw this._handleError(`update ${modelName}`, error);
    }
  }

  async updateById(modelName, id, data, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const updateOptions = {
        new: true,
        runValidators: true,
        ...options
      };

      const doc = await Model.findByIdAndUpdate(id, data, updateOptions);
      if (!doc) {
        this._log(`🔍 ${modelName} with ID ${id} not found`);
        return null;
      }
      
      this._log(`✅ Updated ${modelName}`);
      return doc;
    } catch (error) {
      throw this._handleError(`update ${modelName} by ID`, error);
    }
  }

  async delete(modelName, filter, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const result = await Model.deleteMany(filter, options);
      this._log(`🗑️ Deleted ${result.deletedCount} ${modelName} documents`);
      return result;
    } catch (error) {
      throw this._handleError(`delete ${modelName}`, error);
    }
  }

  async deleteById(modelName, id, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const doc = await Model.findByIdAndDelete(id, options);
      if (!doc) {
        this._log(`🔍 ${modelName} with ID ${id} not found`);
        return null;
      }
      
      this._log(`🗑️ Deleted ${modelName}`);
      return doc;
    } catch (error) {
      throw this._handleError(`delete ${modelName} by ID`, error);
    }
  }

  // ==================== ADVANCED QUERY OPERATIONS ====================

  async count(modelName, filter = {}) {
    try {
      const Model = this._getModel(modelName);
      return await Model.countDocuments(filter);
    } catch (error) {
      throw this._handleError(`count ${modelName}`, error);
    }
  }

  async distinct(modelName, field, filter = {}) {
    try {
      const Model = this._getModel(modelName);
      return await Model.distinct(field, filter);
    } catch (error) {
      throw this._handleError(`distinct ${modelName}`, error);
    }
  }

  async aggregate(modelName, pipeline = []) {
    try {
      const Model = this._getModel(modelName);
      return await Model.aggregate(pipeline);
    } catch (error) {
      throw this._handleError(`aggregate ${modelName}`, error);
    }
  }

  async exists(modelName, filter) {
    try {
      const Model = this._getModel(modelName);
      const doc = await Model.findOne(filter).select('_id').lean();
      return !!doc;
    } catch (error) {
      throw this._handleError(`check exists ${modelName}`, error);
    }
  }

  // ==================== TRANSACTIONS & SESSIONS ====================

  async startSession() {
    if (!this.isConnected) {
      throw new Error('Not connected to database');
    }
    return await mongoose.startSession();
  }

  async transaction(callback) {
    const session = await this.startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      this._log('✅ Transaction committed');
      return result;
    } catch (error) {
      await session.abortTransaction();
      this._error('❌ Transaction aborted:', error.message);
      throw error;
    } finally {
      session.endSession();
    }
  }

  // ==================== SCHEMA EXTENSIONS ====================

  /**
   * Add virtual field to model
   */
  virtual(modelName, field, getter = null, setter = null) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    const virtual = schema.virtual(field);
    if (getter) virtual.get(getter);
    if (setter) virtual.set(setter);
    
    this._log(`🔮 Virtual field '${field}' added to ${modelName}`);
  }

  /**
   * Add static method to model
   */
  static(modelName, name, method) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.statics[name] = method;
    this._log(`⚡ Static method '${name}' added to ${modelName}`);
  }

  /**
   * Add instance method to model
   */
  method(modelName, name, method) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.methods[name] = method;
    this._log(`🎯 Instance method '${name}' added to ${modelName}`);
  }

  /**
   * Add query helper
   */
  query(modelName, name, helper) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.query[name] = helper;
    this._log(`🔍 Query helper '${name}' added to ${modelName}`);
  }

  /**
   * Add middleware (pre/post hooks)
   */
  pre(modelName, hook, callback) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.pre(hook, callback);
    this._log(`⏰ Pre-hook '${hook}' added to ${modelName}`);
  }

  post(modelName, hook, callback) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.post(hook, callback);
    this._log(`📨 Post-hook '${hook}' added to ${modelName}`);
  }

  /**
   * Add plugin to model
   */
  plugin(modelName, plugin, options = {}) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.plugin(plugin, options);
    this._log(`🔌 Plugin added to ${modelName}`);
  }

  /**
   * Add index to model
   */
  async createIndex(modelName, index, options = {}) {
    const Model = this._getModel(modelName);
    try {
      await Model.createIndexes(index, options);
      this._log(`📊 Index created for ${modelName}`);
    } catch (error) {
      throw this._handleError(`create index for ${modelName}`, error);
    }
  }

  // ==================== COMPREHENSIVE TEMPLATES ====================

  templates = {
    user: {
      // Identity
      firstName: 'string!',
      lastName: 'string!',
      email: 'email',
      password: 'password',
      avatar: 'url',
      
      // Profile
      birthDate: 'date?',
      phone: 'string?',
      bio: 'string?',
      
      // Status
      isActive: 'boolean+',
      isVerified: 'boolean+',
      role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
      permissions: ['string'],
      
      // Metrics
      loginCount: { type: Number, default: 0 },
      lastLogin: 'date?',
      
      // Preferences
      settings: {
        theme: { type: String, default: 'light' },
        notifications: { type: Boolean, default: true },
        language: { type: String, default: 'en' }
      }
    },

    product: {
      // Basic info
      name: 'string!',
      sku: 'string!!',
      description: 'string?',
      category: 'string!',
      tags: ['string'],
      
      // Pricing
      price: { type: Number, required: true, min: 0 },
      comparePrice: { type: Number, min: 0 },
      cost: { type: Number, min: 0 },
      
      // Inventory
      inventory: {
        quantity: { type: Number, default: 0 },
        trackQuantity: { type: Boolean, default: true },
        allowOutOfStock: { type: Boolean, default: false }
      },
      
      // Status
      isActive: 'boolean+',
      isFeatured: 'boolean+',
      isDigital: 'boolean+',
      
      // Media
      images: ['url'],
      thumbnail: 'url',
      
      // SEO
      seo: {
        title: 'string?',
        description: 'string?',
        slug: 'string?'
      },
      
      // Analytics
      viewCount: { type: Number, default: 0 },
      purchaseCount: { type: Number, default: 0 }
    },

    post: {
      // Content
      title: 'string!',
      content: 'string!',
      excerpt: 'string?',
      
      // Authorship
      author: 'userRef',
      coAuthors: ['userRef'],
      
      // Metadata
      status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
      visibility: { type: String, enum: ['public', 'private', 'members'], default: 'public' },
      
      // Categorization
      categories: ['string'],
      tags: ['string'],
      
      // Media
      featuredImage: 'url',
      gallery: ['url'],
      
      // Engagement
      viewCount: { type: Number, default: 0 },
      likeCount: { type: Number, default: 0 },
      commentCount: { type: Number, default: 0 },
      
      // SEO
      meta: {
        title: 'string?',
        description: 'string?',
        keywords: ['string']
      }
    },

    order: {
      // Order info
      orderNumber: 'string!!',
      status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
      },
      
      // Customer
      customer: 'userRef',
      email: 'email',
      shippingAddress: {
        name: 'string!',
        street: 'string!',
        city: 'string!',
        state: 'string!',
        country: 'string!',
        zipCode: 'string!',
        phone: 'string?'
      },
      
      // Items
      items: [{
        product: 'productRef',
        name: 'string!',
        price: 'number!',
        quantity: { type: Number, min: 1 },
        total: 'number!'
      }],
      
      // Financials
      subtotal: 'number!',
      tax: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: 'number!',
      
      // Payment
      paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
      paymentMethod: 'string?',
      transactionId: 'string?'
    }
  };

  // ==================== UTILITY METHODS ====================

  _getMongooseType(typeString) {
    const typeMap = {
      'string': String,
      'number': Number,
      'boolean': Boolean,
      'date': Date,
      'array': Array,
      'object': Object,
      'buffer': Buffer,
      'objectid': mongoose.Schema.Types.ObjectId,
      'mixed': mongoose.Schema.Types.Mixed
    };
    return typeMap[typeString] || String;
  }

  _getModel(name) {
    if (!this.models.has(name)) {
      throw new Error(`Model '${name}' not found. Create it first with .model()`);
    }
    return this.models.get(name);
  }

  _handleError(operation, error) {
    let message = `Failed to ${operation}`;
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      message = `${field} already exists. Please use a different value.`;
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      message = `Validation failed: ${errors.join(', ')}`;
    } else if (error.name === 'CastError') {
      message = `Invalid ID format`;
    }

    this._error(`❌ ${message}`);
    
    const simpleError = new Error(message);
    simpleError.originalError = error;
    return simpleError;
  }

  _simplifyError(error) {
    if (error.code === 11000) return new Error('Data already exists. Please use unique values.');
    if (error.name === 'ValidationError') return new Error('Please check your input data.');
    return error;
  }

  _log(message, data = null) {
    if (this.debug) {
      console.log(message, data || '');
    }
  }

  _error(message, data = null) {
    console.error(message, data || '');
  }

  setDebug(debug) {
    this.debug = debug;
    this._log('🔧 Debug mode:', debug ? 'ON' : 'OFF');
  }

  status() {
    const state = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    return {
      connected: this.isConnected,
      readyState: states[state] || state,
      database: this.isConnected ? mongoose.connection.db.databaseName : null,
      host: this.isConnected ? mongoose.connection.host : null,
      models: Array.from(this.models.keys()),
      collections: this.isConnected ? Object.keys(mongoose.connection.collections) : []
    };
  }

  async dropDatabase() {
    if (this.isConnected) {
      await mongoose.connection.db.dropDatabase();
      this._log('🗑️ Database dropped');
    }
  }

  async clearAll() {
    if (this.isConnected) {
      for (const [modelName] of this.models) {
        await this.delete(modelName, {});
      }
      this._log('🧹 Cleared all collections');
    }
  }

  get mongoose() {
    return mongoose;
  }

  get ObjectId() {
    return mongoose.Types.ObjectId;
  }
}

// Create singleton instance
const easyMongoo = new EasyMongoo();

// Export the instance
module.exports = easyMongoo;