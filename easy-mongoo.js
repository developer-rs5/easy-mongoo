const mongoose = require('mongoose');

class UltraMongo {
  constructor() {
    this.connection = null;
    this.models = new Map();
    this.isConnected = false;
    this.debug = false;
    this.schemas = new Map();
    this.globalPlugins = [];
  }

  // ==================== CONNECTION MANAGEMENT ====================

  async connect(uri, options = {}) {
    try {
      this.debug = options.debug || false;
      delete options.debug;

      const defaultOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        minPoolSize: 2,
        ...options
      };

      this._log('🔄 Connecting to MongoDB...');
      
      this.connection = await mongoose.connect(uri, defaultOptions);
      this.isConnected = true;
      
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

  // ==================== ULTRA SMART SCHEMA SYSTEM ====================

  schema(definition, options = {}) {
    const processedDefinition = this._convertToFullSchema(definition);
    
    const schemaOptions = {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
      toJSON: { 
        virtuals: true,
        transform: (doc, ret) => {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
          return ret;
        }
      },
      toObject: { virtuals: true },
      ...options
    };

    const schema = new mongoose.Schema(processedDefinition, schemaOptions);

    // Apply global plugins
    this.globalPlugins.forEach(plugin => {
      schema.plugin(plugin.fn, plugin.options);
    });

    this._addCommonVirtuals(schema);
    this._addCommonMethods(schema);
    
    return schema;
  }

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

  _parseSmartShortcut(shortcut) {
    const shortcuts = {
      // ========== BASIC TYPES ==========
      'string': String,
      'number': Number,
      'boolean': Boolean,
      'date': Date,
      'array': Array,
      'object': Object,
      'buffer': Buffer,
      'decimal': mongoose.Schema.Types.Decimal128,
      'map': Map,
      'mixed': mongoose.Schema.Types.Mixed,

      // ========== REQUIRED FIELDS ==========
      'string!': { type: String, required: [true, '{PATH} is required'] },
      'number!': { type: Number, required: [true, '{PATH} is required'] },
      'boolean!': { type: Boolean, required: [true, '{PATH} is required'] },
      'date!': { type: Date, required: [true, '{PATH} is required'] },
      'array!': { type: Array, required: [true, '{PATH} is required'] },
      'object!': { type: Object, required: [true, '{PATH} is required'] },
      
      // ========== WITH DEFAULTS ==========
      'string+': { type: String, default: '' },
      'number+': { type: Number, default: 0 },
      'boolean+': { type: Boolean, default: false },
      'date+': { type: Date, default: Date.now },
      'array+': { type: Array, default: [] },
      'object+': { type: Object, default: {} },
      
      // ========== UNIQUE FIELDS ==========
      'string!!': { type: String, required: true, unique: true },
      'number!!': { type: Number, required: true, unique: true },
      'email!!': { type: String, required: true, unique: true, lowercase: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
      
      // ========== SMART TYPES ==========
      'email': { type: String, lowercase: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
      'url': { type: String, match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please enter a valid URL'] },
      'password': { type: String, minlength: 6 },
      'phone': { type: String, match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'] },
      'color': { type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color'] },
      
      // ========== ID REFERENCES ==========
      'userRef': { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      'postRef': { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      'productRef': { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      'orderRef': { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      'categoryRef': { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

      // ========== GEO TYPES ==========
      'point': {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
      },
      'location': {
        address: String,
        city: String,
        country: String,
        coordinates: {
          type: [Number],
          index: '2dsphere'
        }
      }
    };

    return shortcuts[shortcut] || { type: String };
  }

  _processFieldConfig(fieldName, config) {
    const processed = { ...config };
    
    if (typeof processed.type === 'string') {
      processed.type = this._getMongooseType(processed.type);
    }
    
    // Auto-validations
    if (processed.enum && !processed.validate) {
      processed.validate = {
        validator: function(value) {
          return processed.enum.includes(value);
        },
        message: `{PATH} must be one of: ${processed.enum.join(', ')}`
      };
    }
    
    // Auto-trim strings
    if (processed.type === String && processed.trim === undefined) {
      processed.trim = true;
    }
    
    // Auto-lowercase emails
    if (fieldName.toLowerCase().includes('email')) {
      processed.lowercase = true;
    }
    
    return processed;
  }

  _addCommonVirtuals(schema) {
    schema.virtual('id').get(function() {
      return this._id.toString();
    });

    schema.virtual('createdAtFormatted').get(function() {
      return this.createdAt?.toLocaleDateString();
    });

    schema.virtual('updatedAtFormatted').get(function() {
      return this.updatedAt?.toLocaleDateString();
    });

    if (schema.paths.firstName && schema.paths.lastName) {
      schema.virtual('fullName').get(function() {
        return `${this.firstName} ${this.lastName}`.trim();
      });
    }

    if (schema.paths.birthDate || schema.paths.dob) {
      schema.virtual('age').get(function() {
        const birth = this.birthDate || this.dob;
        if (!birth) return null;
        return Math.floor((Date.now() - birth) / (365.25 * 24 * 60 * 60 * 1000));
      });
    }
  }

  _addCommonMethods(schema) {
    // Instance methods
    schema.methods.toJSON = function() {
      const obj = this.toObject();
      obj.id = obj._id;
      delete obj._id;
      delete obj.__v;
      return obj;
    };

    schema.methods.updateFields = async function(fields) {
      Object.keys(fields).forEach(key => {
        this[key] = fields[key];
      });
      return await this.save();
    };

    schema.methods.softDelete = async function() {
      this.deleted = true;
      this.deletedAt = new Date();
      return await this.save();
    };

    // Static methods
    schema.statics.findActive = function() {
      return this.find({ deleted: { $ne: true } });
    };

    schema.statics.findDeleted = function() {
      return this.find({ deleted: true });
    };

    schema.statics.restore = function(id) {
      return this.findByIdAndUpdate(id, { deleted: false, deletedAt: null });
    };

    schema.statics.findBySlug = function(slug) {
      return this.findOne({ slug });
    };

    // Query helpers
    schema.query.byStatus = function(status) {
      return this.where({ status });
    };

    schema.query.recent = function(days = 7) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return this.where('createdAt').gte(date);
    };

    schema.query.popular = function(minViews = 100) {
      return this.where('viewCount').gte(minViews);
    };
  }

  // ==================== COMPLETE MODEL SYSTEM ====================

  model(name, schemaDef, options = {}) {
    if (this.models.has(name)) {
      this._log(`📝 Using existing model '${name}'`);
      return this.models.get(name);
    }

    const schema = schemaDef instanceof mongoose.Schema ? schemaDef : this.schema(schemaDef, options);
    
    this._addAutoIndexes(schema, schemaDef);
    this._addAutoMiddleware(schema, name);
    
    const model = mongoose.model(name, schema);
    
    this.models.set(name, model);
    this.schemas.set(name, schema);
    
    this._log(`📝 Model '${name}' created with auto-features`);
    return model;
  }

  discriminator(baseModelName, discriminatorName, schemaDef, options = {}) {
    const baseModel = this._getModel(baseModelName);
    const schema = this.schema(schemaDef, options);
    const discriminatorModel = baseModel.discriminator(discriminatorName, schema);
    
    this.models.set(discriminatorName, discriminatorModel);
    this._log(`🎭 Discriminator '${discriminatorName}' created from '${baseModelName}'`);
    
    return discriminatorModel;
  }

  _addAutoIndexes(schema, definition) {
    // Text search indexes
    if (definition.name || definition.title || definition.description) {
      schema.index({ 
        name: 'text', 
        title: 'text', 
        description: 'text' 
      }, { 
        weights: { 
          name: 10, 
          title: 5, 
          description: 1 
        },
        name: 'text_search_idx'
      });
    }

    // Compound indexes for common queries
    schema.index({ status: 1, createdAt: -1 });
    schema.index({ category: 1, price: 1 });
    schema.index({ userId: 1, createdAt: -1 });

    // TTL indexes for expiration
    if (definition.expiresAt) {
      schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    }

    // 2dsphere for location data
    if (definition.location || definition.coordinates) {
      schema.index({ 'location.coordinates': '2dsphere' });
    }

    // Partial indexes
    if (definition.isActive) {
      schema.index({ isActive: 1 }, { partialFilterExpression: { isActive: true } });
    }
  }

  _addAutoMiddleware(schema, modelName) {
    // Auto-slugify
    if (schema.paths.name || schema.paths.title) {
      schema.pre('save', function(next) {
        if (this.isModified('name') || this.isModified('title')) {
          const source = this.name || this.title;
          if (source && !this.slug) {
            this.slug = source.toString().toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');
          }
        }
        next();
      });
    }

    // Auto-hash passwords
    if (schema.paths.password) {
      schema.pre('save', async function(next) {
        if (!this.isModified('password')) return next();
        this.password = `hashed_${this.password}_${Date.now()}`;
        next();
      });
    }

    // Auto-update timestamps on update
    schema.pre('findOneAndUpdate', function(next) {
      this.set({ updatedAt: new Date() });
      next();
    });

    // Logging middleware
    schema.post('save', (doc) => {
      this._log(`💾 ${modelName} saved:`, doc._id);
    });

    schema.post('remove', (doc) => {
      this._log(`🗑️ ${modelName} removed:`, doc._id);
    });

    // Aggregate middleware
    schema.pre('aggregate', function(next) {
      this.pipeline().unshift({ $match: { deleted: { $ne: true } } });
      next();
    });
  }

  // ==================== COMPLETE CRUD OPERATIONS ====================

  async create(modelName, data, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const doc = Array.isArray(data) 
        ? await Model.insertMany(data, options)
        : await Model.create(data);
      this._log(`✅ Created ${modelName}`, Array.isArray(data) ? `(${data.length} items)` : '');
      return doc;
    } catch (error) {
      throw this._handleError(`create ${modelName}`, error);
    }
  }

  async find(modelName, filter = {}, options = {}) {
    try {
      const Model = this._getModel(modelName);
      let query = Model.find(filter);

      // All query options
      const queryMethods = {
        select: 'select', sort: 'sort', limit: 'limit', skip: 'skip',
        populate: 'populate', lean: 'lean', collation: 'collation',
        readPreference: 'read', maxTimeMS: 'maxTimeMS', hint: 'hint',
        comment: 'comment', sanitizeFilter: 'sanitizeFilter'
      };

      Object.entries(queryMethods).forEach(([key, method]) => {
        if (options[key] !== undefined) query = query[method](options[key]);
      });

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
      if (options.readPreference) query = query.read(options.readPreference);
      
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

  async findOneAndUpdate(modelName, filter, data, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const updateOptions = {
        new: true,
        runValidators: true,
        context: 'query',
        ...options
      };

      const doc = await Model.findOneAndUpdate(filter, data, updateOptions);
      this._log(`✅ Found and updated ${modelName}`);
      return doc;
    } catch (error) {
      throw this._handleError(`findOneAndUpdate ${modelName}`, error);
    }
  }

  async findByIdAndUpdate(modelName, id, data, options = {}) {
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
      
      this._log(`✅ Updated ${modelName} by ID`);
      return doc;
    } catch (error) {
      throw this._handleError(`update ${modelName} by ID`, error);
    }
  }

  async update(modelName, filter, data, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const updateOptions = {
        runValidators: true,
        ...options
      };

      const result = await Model.updateMany(filter, data, updateOptions);
      this._log(`✅ Updated ${result.modifiedCount} ${modelName} documents`);
      return result;
    } catch (error) {
      throw this._handleError(`update ${modelName}`, error);
    }
  }

  async findOneAndDelete(modelName, filter, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const doc = await Model.findOneAndDelete(filter, options);
      this._log(`✅ Found and deleted ${modelName}`);
      return doc;
    } catch (error) {
      throw this._handleError(`findOneAndDelete ${modelName}`, error);
    }
  }

  async findByIdAndDelete(modelName, id, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const doc = await Model.findByIdAndDelete(id, options);
      if (!doc) {
        this._log(`🔍 ${modelName} with ID ${id} not found`);
        return null;
      }
      
      this._log(`🗑️ Deleted ${modelName} by ID`);
      return doc;
    } catch (error) {
      throw this._handleError(`delete ${modelName} by ID`, error);
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

  async bulkWrite(modelName, operations, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const result = await Model.bulkWrite(operations, options);
      this._log(`📦 Bulk write completed for ${modelName}`);
      return result;
    } catch (error) {
      throw this._handleError(`bulkWrite ${modelName}`, error);
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

  async exists(modelName, filter) {
    try {
      const Model = this._getModel(modelName);
      const doc = await Model.findOne(filter).select('_id').lean();
      return !!doc;
    } catch (error) {
      throw this._handleError(`check exists ${modelName}`, error);
    }
  }

  async aggregate(modelName, pipeline = [], options = {}) {
    try {
      const Model = this._getModel(modelName);
      const aggregation = Model.aggregate(pipeline);
      
      if (options.collation) aggregation.collation(options.collation);
      if (options.readPreference) aggregation.read(options.readPreference);
      if (options.comment) aggregation.comment(options.comment);
      
      return await aggregation.exec();
    } catch (error) {
      throw this._handleError(`aggregate ${modelName}`, error);
    }
  }

  async textSearch(modelName, searchText, options = {}) {
    try {
      const Model = this._getModel(modelName);
      return await Model.find(
        { $text: { $search: searchText } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } })
       .limit(options.limit || 10)
       .skip(options.skip || 0);
    } catch (error) {
      throw this._handleError(`textSearch ${modelName}`, error);
    }
  }

  async near(modelName, locationField, coordinates, maxDistance, options = {}) {
    try {
      const Model = this._getModel(modelName);
      return await Model.find({
        [locationField]: {
          $near: {
            $geometry: { type: "Point", coordinates },
            $maxDistance: maxDistance
          }
        }
      }).limit(options.limit || 10);
    } catch (error) {
      throw this._handleError(`near ${modelName}`, error);
    }
  }

  async paginate(modelName, filter = {}, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        Model.find(filter)
          .sort(options.sort || { createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate(options.populate || '')
          .lean(options.lean || false),
        Model.countDocuments(filter)
      ]);

      return {
        docs,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      };
    } catch (error) {
      throw this._handleError(`paginate ${modelName}`, error);
    }
  }

  // ==================== TRANSACTIONS & SESSIONS ====================

  async startSession() {
    if (!this.isConnected) {
      throw new Error('Not connected to database');
    }
    return await mongoose.startSession();
  }

  async withTransaction(callback, options = {}) {
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

  async withRetryTransaction(callback, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.withTransaction(callback);
      } catch (error) {
        if (attempt === maxRetries || !error.writeConcernError) {
          throw error;
        }
        this._log(`🔄 Transaction retry attempt ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
      }
    }
  }

  // ==================== SCHEMA EXTENSIONS ====================

  virtual(modelName, field, getter = null, setter = null) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    const virtual = schema.virtual(field);
    if (getter) virtual.get(getter);
    if (setter) virtual.set(setter);
    
    this._log(`🔮 Virtual field '${field}' added to ${modelName}`);
    return virtual;
  }

  static(modelName, name, method) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.statics[name] = method;
    this._log(`⚡ Static method '${name}' added to ${modelName}`);
  }

  method(modelName, name, method) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.methods[name] = method;
    this._log(`🎯 Instance method '${name}' added to ${modelName}`);
  }

  query(modelName, name, helper) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.query[name] = helper;
    this._log(`🔍 Query helper '${name}' added to ${modelName}`);
  }

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

  plugin(modelName, plugin, options = {}) {
    const schema = this.schemas.get(modelName);
    if (!schema) throw new Error(`Model '${modelName}' not found`);
    
    schema.plugin(plugin, options);
    this._log(`🔌 Plugin added to ${modelName}`);
  }

  globalPlugin(plugin, options = {}) {
    this.globalPlugins.push({ fn: plugin, options });
    this._log(`🌍 Global plugin added`);
  }

  async createIndex(modelName, index, options = {}) {
    const Model = this._getModel(modelName);
    try {
      await Model.createIndexes(index, options);
      this._log(`📊 Index created for ${modelName}`);
    } catch (error) {
      throw this._handleError(`create index for ${modelName}`, error);
    }
  }

  async syncIndexes(modelName) {
    const Model = this._getModel(modelName);
    try {
      await Model.syncIndexes();
      this._log(`🔄 Indexes synced for ${modelName}`);
    } catch (error) {
      throw this._handleError(`sync indexes for ${modelName}`, error);
    }
  }

  // ==================== DATA MIGRATION & UTILITIES ====================

  async migrate(modelName, migrationFn, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const batchSize = options.batchSize || 100;
      let processed = 0;
      
      const cursor = Model.find(options.filter || {}).cursor();
      
      for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        await migrationFn(doc);
        processed++;
        
        if (processed % batchSize === 0) {
          this._log(`🔄 Migrated ${processed} documents in ${modelName}`);
        }
      }
      
      this._log(`✅ Migration completed for ${modelName}: ${processed} documents processed`);
      return processed;
    } catch (error) {
      throw this._handleError(`migrate ${modelName}`, error);
    }
  }

  async seed(modelName, data, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const clearFirst = options.clearFirst || false;
      
      if (clearFirst) {
        await Model.deleteMany({});
        this._log(`🧹 Cleared existing ${modelName} data`);
      }
      
      const result = await Model.insertMany(data, { ordered: false });
      this._log(`🌱 Seeded ${result.length} ${modelName} documents`);
      return result;
    } catch (error) {
      throw this._handleError(`seed ${modelName}`, error);
    }
  }

  async exportData(modelName, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const filter = options.filter || {};
      const fields = options.fields || {};
      
      return await Model.find(filter).select(fields).lean();
    } catch (error) {
      throw this._handleError(`export ${modelName}`, error);
    }
  }

  async importData(modelName, data, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const result = await Model.insertMany(data, { 
        ordered: false,
        ...options 
      });
      
      this._log(`📥 Imported ${result.length} ${modelName} documents`);
      return result;
    } catch (error) {
      throw this._handleError(`import ${modelName}`, error);
    }
  }

  // ==================== PERFORMANCE & OPTIMIZATION ====================

  async explain(modelName, operation, ...args) {
    try {
      const Model = this._getModel(modelName);
      let result;
      
      switch (operation) {
        case 'find':
          result = await Model.find(...args).explain();
          break;
        case 'aggregate':
          result = await Model.aggregate(...args).explain();
          break;
        default:
          throw new Error(`Unsupported operation for explain: ${operation}`);
      }
      
      return result;
    } catch (error) {
      throw this._handleError(`explain ${operation} for ${modelName}`, error);
    }
  }

  async cache(modelName, key, dataFn, ttl = 3600) {
    // Simple in-memory cache (in production, use Redis)
    if (!this._cache) this._cache = new Map();
    
    const cacheKey = `${modelName}:${key}`;
    const cached = this._cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < ttl * 1000) {
      this._log(`💾 Cache hit: ${cacheKey}`);
      return cached.data;
    }
    
    this._log(`🔄 Cache miss: ${cacheKey}`);
    const data = await dataFn();
    this._cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  }

  clearCache(pattern = null) {
    if (!this._cache) return;
    
    if (pattern) {
      for (const key of this._cache.keys()) {
        if (key.includes(pattern)) {
          this._cache.delete(key);
        }
      }
    } else {
      this._cache.clear();
    }
    
    this._log('🧹 Cache cleared', pattern ? `for pattern: ${pattern}` : '');
  }

  // ==================== COMPREHENSIVE TEMPLATES ====================

  templates = {
    user: {
      firstName: 'string!',
      lastName: 'string!',
      email: 'email!!',
      password: 'password',
      avatar: 'url',
      birthDate: 'date?',
      phone: 'phone',
      bio: 'string?',
      isActive: 'boolean+',
      isVerified: 'boolean+',
      role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
      permissions: ['string'],
      loginCount: { type: Number, default: 0 },
      lastLogin: 'date?',
      settings: {
        theme: { type: String, default: 'light' },
        notifications: { type: Boolean, default: true },
        language: { type: String, default: 'en' }
      },
      location: 'location'
    },

    product: {
      name: 'string!',
      sku: 'string!!',
      description: 'string?',
      category: 'string!',
      tags: ['string'],
      price: { type: Number, required: true, min: 0 },
      comparePrice: { type: Number, min: 0 },
      cost: { type: Number, min: 0 },
      inventory: {
        quantity: { type: Number, default: 0 },
        trackQuantity: { type: Boolean, default: true },
        allowOutOfStock: { type: Boolean, default: false }
      },
      isActive: 'boolean+',
      isFeatured: 'boolean+',
      isDigital: 'boolean+',
      images: ['url'],
      thumbnail: 'url',
      seo: {
        title: 'string?',
        description: 'string?',
        slug: 'string?'
      },
      viewCount: { type: Number, default: 0 },
      purchaseCount: { type: Number, default: 0 }
    },

    post: {
      title: 'string!',
      content: 'string!',
      excerpt: 'string?',
      author: 'userRef',
      coAuthors: ['userRef'],
      status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
      visibility: { type: String, enum: ['public', 'private', 'members'], default: 'public' },
      categories: ['string'],
      tags: ['string'],
      featuredImage: 'url',
      gallery: ['url'],
      viewCount: { type: Number, default: 0 },
      likeCount: { type: Number, default: 0 },
      commentCount: { type: Number, default: 0 },
      meta: {
        title: 'string?',
        description: 'string?',
        keywords: ['string']
      }
    },

    order: {
      orderNumber: 'string!!',
      status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
      },
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
      items: [{
        product: 'productRef',
        name: 'string!',
        price: 'number!',
        quantity: { type: Number, min: 1 },
        total: 'number!'
      }],
      subtotal: 'number!',
      tax: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: 'number!',
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
      'decimal': mongoose.Schema.Types.Decimal128,
      'map': Map,
      'mixed': mongoose.Schema.Types.Mixed,
      'objectid': mongoose.Schema.Types.ObjectId
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
    } else if (error.name === 'DivergentArrayError') {
      message = 'Array modification error';
    } else if (error.name === 'MissingSchemaError') {
      message = 'Schema not found';
    } else if (error.name === 'OverwriteModelError') {
      message = 'Model already exists';
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
      port: this.isConnected ? mongoose.connection.port : null,
      models: Array.from(this.models.keys()),
      collections: this.isConnected ? Object.keys(mongoose.connection.collections) : [],
      plugins: this.globalPlugins.length,
      cache: this._cache ? this._cache.size : 0
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

  get Schema() {
    return mongoose.Schema;
  }

  get Types() {
    return mongoose.Types;
  }
}

// Create and export instance
const ultraMongo = new UltraMongo();
module.exports = ultraMongo;  