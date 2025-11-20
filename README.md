# Easy-Mongoo 🚀

[![npm version](https://img.shields.io/npm/v/easy-mongoo.svg)](https://www.npmjs.com/package/easy-mongoo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/easy-mongoo.svg)](https://www.npmjs.com/package/easy-mongoo)

Ultra-simple MongoDB wrapper with all Mongoose features in easy syntax. Make MongoDB operations effortless while maintaining enterprise-grade power and flexibility.

## ✨ Features

- 🎯 **One-Line Operations** - Perform complex database operations with minimal code
- 🛡️ **Auto Error Handling** - Automatic error handling with user-friendly messages
- 🔧 **Smart Schema System** - Create schemas with simple shortcuts and auto-features
- ⚡ **All Mongoose Features** - Virtuals, middleware, transactions, aggregation - everything included!
- 📦 **Zero Configuration** - Start coding immediately with sensible defaults
- 🎨 **Predefined Templates** - Ready-to-use schema templates for common use cases
- 🔐 **Built-in Validation** - Smart validation with friendly error messages
- 🚄 **High Performance** - Optimized for speed without sacrificing functionality

## 📦 Installation
```bash
npm install easy-mongoo
```

## 🚀 Quick Start

Get up and running in just 3 steps:
```javascript
const mongoo = require('easy-mongoo');

// 1. Connect to MongoDB
await mongoo.connect('mongodb://localhost:27017/mydb');

// 2. Create a model with easy schema
mongoo.model('User', {
  name: 'string!',
  email: 'email',
  age: 'number?'
});

// 3. Use it!
const user = await mongoo.create('User', {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

console.log(user);
```

That's it! You've just created a MongoDB connection, defined a schema, and saved a document.

## 📖 Table of Contents

- [Connection](#-connection)
- [Schema Creation](#-schema-creation)
- [Models](#-models)
- [CRUD Operations](#-crud-operations)
- [Virtual Fields](#-virtual-fields)
- [Methods & Statics](#-methods--statics)
- [Middleware (Hooks)](#-middleware-hooks)
- [Transactions](#-transactions)
- [Aggregation](#-aggregation)
- [Indexes](#-indexes)
- [Plugins](#-plugins)
- [Advanced Features](#-advanced-features)
- [Error Handling](#-error-handling)
- [Mongoose vs Easy-Mongoo](#-mongoose-vs-easy-mongoo)

## 🔌 Connection

Connect to MongoDB with automatic error handling:
```javascript
// Basic connection
await mongoo.connect('mongodb://localhost:27017/mydb');

// With options and debug mode
await mongoo.connect('mongodb://localhost:27017/mydb', {
  debug: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Check connection status
const status = mongoo.status();
console.log(status);
// { connected: true, database: 'mydb', host: 'localhost:27017', ... }

// Disconnect when done
await mongoo.disconnect();
```

## 📝 Schema Creation

Easy-Mongoo provides an ultra-simple schema system with smart shortcuts:

### Basic Schema Shortcuts
```javascript
const userSchema = {
  // Required string
  name: 'string!',
  
  // Optional number
  age: 'number?',
  
  // Boolean with default value
  isActive: 'boolean+',
  
  // Array of strings
  tags: ['string'],
  
  // Object with nested properties
  address: {
    street: 'string!',
    city: 'string!',
    country: 'string!'
  }
};
```

### Schema Shortcuts Reference

| Shortcut     | Description                | Equivalent To                                         |
| ------------ | -------------------------- | ----------------------------------------------------- |
| `'string!'`  | Required string            | `{ type: String, required: true }`                    |
| `'number?'`  | Optional number            | `Number`                                              |
| `'boolean+'` | Boolean with default false | `{ type: Boolean, default: false }`                   |
| `'email'`    | Email with validation      | `{ type: String, required: true, match: emailRegex }` |
| `'password'` | Password with min length   | `{ type: String, required: true, minlength: 6 }`      |
| `'url'`      | URL with validation        | `{ type: String, match: urlRegex }`                   |
| `'date'`     | Date field                 | `Date`                                                |
| `'userRef'`  | Reference to User model    | `{ type: ObjectId, ref: 'User' }`                     |

### Advanced Schema with Validations
```javascript
const productSchema = {
  name: {
    type: 'string',
    required: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  price: {
    type: 'number',
    required: true,
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: 'string',
    enum: ['Electronics', 'Clothing', 'Books'],
    default: 'Electronics'
  },
  inStock: {
    type: 'boolean',
    default: true
  }
};
```

## 🎨 Models

Create models with automatic features and enhancements:
```javascript
// Create a model
const User = mongoo.model('User', {
  firstName: 'string!',
  lastName: 'string!',
  email: 'email',
  birthDate: 'date?'
});

// Get existing model
const User = mongoo.getModel('User');

// Use predefined template
const User = mongoo.model('User', mongoo.templates.user);
```

**Auto-Features Included:**
- ✅ Timestamps: Automatic `createdAt` and `updatedAt` fields
- ✅ Indexes: Auto-indexing for common fields
- ✅ Virtuals: Automatic virtual fields (`fullName`, `age`, etc.)
- ✅ Middleware: Auto-hooks for common operations
- ✅ Validation: Smart validation with friendly messages

## 🔨 CRUD Operations

Complete CRUD operations with simplified syntax:

### Create
```javascript
// Create a single document
const user = await mongoo.create('User', {
  name: 'Alice',
  email: 'alice@example.com',
  age: 28
});

// Create multiple documents
const users = await mongoo.create('User', [
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Charlie', email: 'charlie@example.com' }
]);

// Find or create
const user = await mongoo.findOrCreate('User',
  { email: 'alice@example.com' },
  { name: 'Alice', age: 28 }
);
```

### Read
```javascript
// Find all documents
const users = await mongoo.find('User');

// Find with filter
const activeUsers = await mongoo.find('User', {
  isActive: true,
  age: { $gte: 18 }
});

// Find one document
const user = await mongoo.findOne('User', { email: 'alice@example.com' });

// Find by ID
const user = await mongoo.findById('User', '507f1f77bcf86cd799439011');

// Find with options
const users = await mongoo.find('User', {}, {
  sort: { createdAt: -1 },
  limit: 10,
  select: 'name email',
  populate: 'posts'
});
```

### Update
```javascript
// Update multiple documents
await mongoo.update('User',
  { isActive: false },
  { status: 'inactive' }
);

// Update by ID
const updatedUser = await mongoo.updateById('User',
  '507f1f77bcf86cd799439011',
  { age: 29, lastLogin: new Date() }
);

// Save (create or update)
const user = await mongoo.save('User', {
  _id: '507f1f77bcf86cd799439011', // If provided, updates existing
  name: 'Alice Updated',
  email: 'alice.updated@example.com'
});
```

### Delete
```javascript
// Delete multiple documents
await mongoo.delete('User', { isActive: false });

// Delete by ID
await mongoo.deleteById('User', '507f1f77bcf86cd799439011');

// Check if document exists
const exists = await mongoo.exists('User', { email: 'alice@example.com' });

// Count documents
const count = await mongoo.count('User', { isActive: true });
```

## 🎭 Virtual Fields

Virtual fields are computed properties that don't get stored in MongoDB:
```javascript
// Auto virtuals (already included)
// - fullName (if firstName and lastName exist)
// - age (if birthDate exists)
// - createdAtFormatted

// Custom virtual field
mongoo.virtual('User', 'profileUrl', function() {
  return `/users/${this.slug || this._id}`;
});

// Virtual with setter
mongoo.virtual('User', 'fullName',
  // Getter
  function() {
    return `${this.firstName} ${this.lastName}`;
  },
  // Setter
  function(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts.slice(1).join(' ');
  }
);

// Usage
const user = await mongoo.findById('User', '...');
console.log(user.fullName); // Computed property
console.log(user.profileUrl); // Custom virtual
```

## 🔧 Methods & Statics

Add custom instance methods and static methods to your models:

### Instance Methods
```javascript
// Add instance method
mongoo.method('User', 'getProfile', function() {
  return {
    name: this.name,
    email: this.email,
    memberSince: this.createdAt,
    profileUrl: `/users/${this._id}`
  };
});

// Instance method with async operations
mongoo.method('User', 'deactivate', async function(reason) {
  this.isActive = false;
  this.deactivationReason = reason;
  this.deactivatedAt = new Date();
  return await this.save();
});

// Usage
const user = await mongoo.findById('User', '...');
const profile = user.getProfile();
await user.deactivate('User requested');
```

### Static Methods
```javascript
// Add static method
mongoo.static('User', 'findByEmail', async function(email) {
  return await this.findOne({ email }).populate('posts');
});

// Static method with complex logic
mongoo.static('User', 'getActiveStats', async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        avgAge: { $avg: '$age' },
        maxAge: { $max: '$age' },
        minAge: { $min: '$age' }
      }
    }
  ]);
  return stats[0] || {};
});

// Usage
const user = await mongoo.getModel('User').findByEmail('alice@example.com');
const stats = await mongoo.getModel('User').getActiveStats();
```

### Query Helpers
```javascript
// Add query helper
mongoo.query('User', 'byAgeRange', function(min, max) {
  return this.where('age').gte(min).lte(max);
});

// Query helper for text search
mongoo.query('User', 'search', function(text) {
  return this.find({
    $or: [
      { name: { $regex: text, $options: 'i' } },
      { email: { $regex: text, $options: 'i' } }
    ]
  });
});

// Usage
const adults = await mongoo.find('User').byAgeRange(18, 65);
const searchResults = await mongoo.find('User').search('alice');
```

## 🪝 Middleware (Hooks)

Middleware (hooks) allow you to execute functions before or after certain operations:

### Pre Hooks
```javascript
// Pre-save hook
mongoo.pre('User', 'save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Pre-remove hook
mongoo.pre('User', 'remove', async function(next) {
  // Remove user's posts when user is deleted
  await mongoo.delete('Post', { author: this._id });
  next();
});

// Pre-find hook
mongoo.pre('User', 'find', function(next) {
  // Only find active users by default
  this.where({ isActive: true });
  next();
});
```

### Post Hooks
```javascript
// Post-save hook
mongoo.post('User', 'save', function(doc) {
  console.log(`User ${doc.name} was saved`);
});

// Post-remove hook
mongoo.post('User', 'remove', function(doc) {
  console.log(`User ${doc.name} was removed`);
});

// Post-find hook
mongoo.post('User', 'find', function(docs) {
  console.log(`Found ${docs.length} users`);
});
```

### Aggregate Hooks
```javascript
// Pre-aggregate hook
mongoo.pre('User', 'aggregate', function(next) {
  // Add match stage to exclude deleted users
  this.pipeline().unshift({ $match: { isActive: true } });
  next();
});

// Post-aggregate hook
mongoo.post('User', 'aggregate', function(docs) {
  console.log(`Aggregation returned ${docs.length} documents`);
});
```

## 💳 Transactions

Execute multiple operations as a single atomic transaction:
```javascript
// Basic transaction
await mongoo.withTransaction(async (session) => {
  // Create user
  const user = await mongoo.create('User', {
    name: 'Alice',
    email: 'alice@example.com'
  }, { session });
  
  // Create user's first post
  await mongoo.create('Post', {
    title: 'First Post',
    content: 'Hello World!',
    author: user._id
  }, { session });
});

// Transaction with retry logic
await mongoo.withRetryTransaction(async (session) => {
  // Transfer money between accounts
  await mongoo.update(
    'Account',
    { _id: 'fromAccountId', balance: { $gte: 100 } },
    { $inc: { balance: -100 } },
    { session }
  );
  
  await mongoo.update(
    'Account',
    { _id: 'toAccountId' },
    { $inc: { balance: 100 } },
    { session }
  );
}, 3); // Retry up to 3 times

// Manual session management
const session = await mongoo.startSession();
try {
  session.startTransaction();
  
  // Your operations here
  await mongoo.create('User', userData, { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## 📊 Aggregation

Perform complex data analysis with MongoDB aggregation pipeline:

### Basic Aggregation
```javascript
// Basic aggregation - group by category
const categoryStats = await mongoo.aggregate('Product', [
  {
    $group: {
      _id: '$category',
      totalProducts: { $sum: 1 },
      avgPrice: { $avg: '$price' },
      maxPrice: { $max: '$price' },
      minPrice: { $min: '$price' }
    }
  },
  { $sort: { totalProducts: -1 } }
]);

// Lookup aggregation (join collections)
const userOrders = await mongoo.aggregate('Order', [
  {
    $lookup: {
      from: 'users',
      localField: 'customer',
      foreignField: '_id',
      as: 'customerInfo'
    }
  },
  { $unwind: '$customerInfo' },
  {
    $project: {
      orderNumber: 1,
      total: 1,
      customerName: '$customerInfo.name',
      customerEmail: '$customerInfo.email'
    }
  }
]);
```

### Advanced Pipeline
```javascript
// Advanced aggregation with multiple stages
const salesReport = await mongoo.aggregate('Order', [
  // Match orders from last 30 days
  {
    $match: {
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      status: 'completed'
    }
  },
  // Unwind items array
  { $unwind: '$items' },
  // Lookup product details
  {
    $lookup: {
      from: 'products',
      localField: 'items.product',
      foreignField: '_id',
      as: 'productInfo'
    }
  },
  // Unwind product info
  { $unwind: '$productInfo' },
  // Group by product category
  {
    $group: {
      _id: '$productInfo.category',
      totalRevenue: { $sum: '$items.total' },
      totalUnits: { $sum: '$items.quantity' },
      avgOrderValue: { $avg: '$total' }
    }
  },
  // Sort by revenue
  { $sort: { totalRevenue: -1 } }
]);
```

### Faceted Search
```javascript
// Faceted search with multiple aggregations
const facetedResults = await mongoo.aggregate('Product', [
  {
    $match: {
      price: { $lte: 1000 },
      isActive: true
    }
  },
  {
    $facet: {
      // Price ranges
      priceRanges: [
        {
          $bucket: {
            groupBy: '$price',
            boundaries: [0, 50, 100, 200, 500, 1000],
            default: 'Other',
            output: {
              count: { $sum: 1 },
              products: { $push: '$name' }
            }
          }
        }
      ],
      // Categories
      categories: [
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ],
      // Total count
      totalCount: [
        { $count: 'count' }
      ]
    }
  }
]);
```

## 🔍 Indexes

Create and manage indexes for better query performance:
```javascript
// Create single field index
await mongoo.index('User', { email: 1 });

// Create compound index
await mongoo.index('User', { lastName: 1, firstName: 1 });

// Create unique index
await mongoo.index('User', { email: 1 }, { unique: true });

// Create text index for full-text search
await mongoo.index('Product', { name: 'text', description: 'text' });

// Create TTL index (auto-delete documents)
await mongoo.index('Session', { createdAt: 1 }, { expireAfterSeconds: 3600 });

// Create geospatial index
await mongoo.index('Location', { coordinates: '2dsphere' });

// Get all indexes
const indexes = await mongoo.getIndexes('User');

// Drop an index
await mongoo.dropIndex('User', 'email_1');
```

## 🔌 Plugins

Extend Easy-Mongoo with custom plugins:
```javascript
// Create a plugin
const timestampPlugin = function(schema, options) {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
};

// Apply plugin to a specific model
mongoo.plugin('User', timestampPlugin);

// Apply plugin globally to all models
mongoo.plugin(timestampPlugin);

// Plugin with options
const softDeletePlugin = function(schema, options) {
  schema.add({
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  });
  
  schema.pre('find', function() {
    if (!options.includeDeleted) {
      this.where({ deleted: false });
    }
  });
  
  schema.methods.softDelete = function() {
    this.deleted = true;
    this.deletedAt = new Date();
    return this.save();
  };
};

mongoo.plugin('User', softDeletePlugin, { includeDeleted: false });
```

## 🌟 Advanced Features

### Pagination
```javascript
// Paginate results
const result = await mongoo.paginate('User', 
  { isActive: true }, // filter
  { 
    page: 1, 
    limit: 10, 
    sort: { createdAt: -1 },
    select: 'name email'
  }
);

console.log(result);
// {
//   docs: [...],
//   totalDocs: 100,
//   limit: 10,
//   page: 1,
//   totalPages: 10,
//   hasNextPage: true,
//   hasPrevPage: false,
//   nextPage: 2,
//   prevPage: null
// }
```

### Bulk Operations
```javascript
// Bulk write operations
await mongoo.bulkWrite('User', [
  {
    insertOne: {
      document: { name: 'Alice', email: 'alice@example.com' }
    }
  },
  {
    updateOne: {
      filter: { email: 'bob@example.com' },
      update: { $set: { status: 'active' } }
    }
  },
  {
    deleteOne: {
      filter: { email: 'old@example.com' }
    }
  }
]);

// Bulk insert
await mongoo.insertMany('User', [
  { name: 'User1', email: 'user1@example.com' },
  { name: 'User2', email: 'user2@example.com' },
  { name: 'User3', email: 'user3@example.com' }
]);
```

### Text Search
```javascript
// Create text index first
await mongoo.index('Article', { title: 'text', content: 'text' });

// Perform text search
const articles = await mongoo.find('Article', {
  $text: { $search: 'mongodb database' }
}, {
  score: { $meta: 'textScore' },
  sort: { score: { $meta: 'textScore' } }
});
```

### Geospatial Queries
```javascript
// Create geospatial index
await mongoo.index('Store', { location: '2dsphere' });

// Find nearby locations
const nearbyStores = await mongoo.find('Store', {
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [-73.97, 40.77] // [longitude, latitude]
      },
      $maxDistance: 5000 // 5km in meters
    }
  }
});

// Find within polygon
const storesInArea = await mongoo.find('Store', {
  location: {
    $geoWithin: {
      $geometry: {
        type: 'Polygon',
        coordinates: [[
          [-73.98, 40.75],
          [-73.96, 40.75],
          [-73.96, 40.78],
          [-73.98, 40.78],
          [-73.98, 40.75]
        ]]
      }
    }
  }
});
```

### Discriminators (Inheritance)
```javascript
// Base schema
const eventSchema = {
  title: 'string!',
  date: 'date!',
  type: 'string!'
};

mongoo.model('Event', eventSchema);

// Create discriminators
const clickEventSchema = {
  elementId: 'string!',
  coordinates: {
    x: 'number!',
    y: 'number!'
  }
};

mongoo.discriminator('Event', 'ClickEvent', clickEventSchema);

const purchaseEventSchema = {
  productId: 'string!',
  amount: 'number!',
  currency: 'string!'
};

mongoo.discriminator('Event', 'PurchaseEvent', purchaseEventSchema);

// Usage
await mongoo.create('ClickEvent', {
  title: 'Button Click',
  date: new Date(),
  type: 'click',
  elementId: 'btn-submit',
  coordinates: { x: 100, y: 200 }
});

await mongoo.create('PurchaseEvent', {
  title: 'Product Purchase',
  date: new Date(),
  type: 'purchase',
  productId: 'prod-123',
  amount: 99.99,
  currency: 'USD'
});
```

### Caching
```javascript
// Enable caching
mongoo.enableCache({ ttl: 300 }); // 5 minutes TTL

// Query with cache
const users = await mongoo.find('User', { isActive: true }, { cache: true });

// Clear cache for a model
mongoo.clearCache('User');

// Clear all cache
mongoo.clearAllCache();

// Disable caching
mongoo.disableCache();
```

## ❌ Error Handling

Easy-Mongoo provides comprehensive error handling:
```javascript
try {
  await mongoo.create('User', {
    email: 'invalid-email' // Will fail validation
  });
} catch (error) {
  console.log(error.name); // 'ValidationError'
  console.log(error.message); // User-friendly message
  console.log(error.errors); // Detailed field errors
}

// Common error types:
// - ValidationError: Schema validation failed
// - CastError: Type casting failed
// - DuplicateKeyError: Unique constraint violation
// - DocumentNotFoundError: Document not found
// - VersionError: Version conflict in update
```

## 🎯 Predefined Templates

Easy-Mongoo includes ready-to-use schema templates:
```javascript
// User template
mongoo.model('User', mongoo.templates.user);
// Includes: name, email, password, role, isActive, timestamps

// Product template
mongoo.model('Product', mongoo.templates.product);
// Includes: name, description, price, category, stock, images

// Post/Article template
mongoo.model('Post', mongoo.templates.post);
// Includes: title, content, author, tags, published, views

// Comment template
mongoo.model('Comment', mongoo.templates.comment);
// Includes: text, author, post, likes, createdAt

// Category template
mongoo.model('Category', mongoo.templates.category);
// Includes: name, slug, description, parent, order
```

## 🐛 Debugging

Enable debugging to see detailed logs:
```javascript
// Enable debug mode
await mongoo.connect('mongodb://localhost:27017/mydb', {
  debug: true
});

// Or enable later
mongoo.setDebug(true);

// Custom debug handler
mongoo.setDebug((collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, query, doc);
});

// Disable debug mode
mongoo.setDebug(false);
```

## 📚 API Reference

### Connection Methods
- `connect(uri, options)` - Connect to MongoDB
- `disconnect()` - Disconnect from MongoDB
- `status()` - Get connection status

### Model Methods
- `model(name, schema)` - Create or get a model
- `getModel(name)` - Get existing model
- `discriminator(baseModel, name, schema)` - Create discriminator

### CRUD Methods
- `create(model, data, options)` - Create document(s)
- `find(model, filter, options)` - Find documents
- `findOne(model, filter, options)` - Find one document
- `findById(model, id, options)` - Find by ID
- `update(model, filter, data, options)` - Update documents
- `updateById(model, id, data, options)` - Update by ID
- `save(model, data, options)` - Create or update
- `delete(model, filter, options)` - Delete documents
- `deleteById(model, id, options)` - Delete by ID
- `exists(model, filter)` - Check if document exists
- `count(model, filter)` - Count documents
- `findOrCreate(model, filter, data)` - Find or create

### Advanced Methods
- `aggregate(model, pipeline, options)` - Run aggregation
- `paginate(model, filter, options)` - Paginate results
- `bulkWrite(model, operations)` - Bulk operations
- `insertMany(model, docs, options)` - Insert multiple
- `withTransaction(callback)` - Run transaction
- `withRetryTransaction(callback, maxRetries)` - Transaction with retry

### Schema Enhancement Methods
- `virtual(model, name, getter, setter)` - Add virtual field
- `method(model, name, fn)` - Add instance method
- `static(model, name, fn)` - Add static method
- `query(model, name, fn)` - Add query helper
- `pre(model, hook, fn)` - Add pre hook
- `post(model, hook, fn)` - Add post hook
- `plugin(model, plugin, options)` - Add plugin

### Index Methods
- `index(model, fields, options)` - Create index
- `getIndexes(model)` - Get all indexes
- `dropIndex(model, indexName)` - Drop index

### Cache Methods
- `enableCache(options)` - Enable caching
- `disableCache()` - Disable caching
- `clearCache(model)` - Clear model cache
- `clearAllCache()` - Clear all cache

## 🆚 Mongoose vs Easy-Mongoo

Here's a detailed comparison showing how Easy-Mongoo simplifies your code:

### Connection

**Mongoose:**
```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

// Check connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected');
});
```

**Easy-Mongoo:**
```javascript
const mongoo = require('easy-mongoo');

await mongoo.connect('mongodb://localhost:27017/mydb');
// That's it! Auto error handling and logging included

// Check status
const status = mongoo.status();
```

### Schema Definition

**Mongoose:**
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+.\S+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative']
  },
  isActive: {
  type: Boolean,
  default: true
}
}, {
timestamps: true
});
// Add virtuals
userSchema.virtual('fullName').get(function() {
return ${this.firstName} ${this.lastName};
});
const User = mongoose.model('User', userSchema);

**Easy-Mongoo:**
```javascript
const mongoo = require('easy-mongoo');

mongoo.model('User', {
  firstName: 'string!',
  lastName: 'string!',
  email: 'email',
  age: 'number?',
  isActive: 'boolean+'
});

// Virtuals like fullName are auto-generated!
```

### CRUD Operations

**Mongoose:**
```javascript
// CREATE
const user = new User({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  age: 30
});

try {
  await user.save();
  console.log('User created');
} catch (error) {
  console.error('Error creating user:', error);
}

// READ
try {
  const users = await User.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('firstName lastName email')
    .exec();
} catch (error) {
  console.error('Error finding users:', error);
}

// UPDATE
try {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { age: 31 },
    { new: true, runValidators: true }
  );
} catch (error) {
  console.error('Error updating user:', error);
}

// DELETE
try {
  await User.findByIdAndDelete(userId);
} catch (error) {
  console.error('Error deleting user:', error);
}
```

**Easy-Mongoo:**
```javascript
// CREATE
const user = await mongoo.create('User', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  age: 30
});

// READ
const users = await mongoo.find('User', { isActive: true }, {
  sort: { createdAt: -1 },
  limit: 10,
  select: 'firstName lastName email'
});

// UPDATE
const updatedUser = await mongoo.updateById('User', userId, { age: 31 });

// DELETE
await mongoo.deleteById('User', userId);

// Auto error handling included!
```

### Virtual Fields

**Mongoose:**
```javascript
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  birthDate: Date
});

// Define virtual for fullName
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Define virtual for age
userSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Make sure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
```

**Easy-Mongoo:**
```javascript
mongoo.model('User', {
  firstName: 'string!',
  lastName: 'string!',
  birthDate: 'date?'
});

// fullName and age virtuals are auto-generated!
// Just use them:
const user = await mongoo.findById('User', userId);
console.log(user.fullName); // "John Doe"
console.log(user.age); // 30
```

### Instance Methods

**Mongoose:**
```javascript
const userSchema = new Schema({
  name: String,
  email: String,
  isActive: Boolean
});

userSchema.methods.deactivate = async function(reason) {
  this.isActive = false;
  this.deactivationReason = reason;
  this.deactivatedAt = new Date();
  return await this.save();
};

userSchema.methods.getProfile = function() {
  return {
    name: this.name,
    email: this.email,
    memberSince: this.createdAt
  };
};

const User = mongoose.model('User', userSchema);

// Usage
const user = await User.findById(userId);
await user.deactivate('User requested');
const profile = user.getProfile();
```

**Easy-Mongoo:**
```javascript
mongoo.model('User', {
  name: 'string!',
  email: 'email',
  isActive: 'boolean+'
});

mongoo.method('User', 'deactivate', async function(reason) {
  this.isActive = false;
  this.deactivationReason = reason;
  this.deactivatedAt = new Date();
  return await this.save();
});

mongoo.method('User', 'getProfile', function() {
  return {
    name: this.name,
    email: this.email,
    memberSince: this.createdAt
  };
});

// Usage
const user = await mongoo.findById('User', userId);
await user.deactivate('User requested');
const profile = user.getProfile();
```

### Static Methods

**Mongoose:**
```javascript
const userSchema = new Schema({
  email: String,
  isActive: Boolean
});

userSchema.statics.findByEmail = async function(email) {
  return await this.findOne({ email }).populate('posts');
};

userSchema.statics.getActiveStats = async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        avgAge: { $avg: '$age' }
      }
    }
  ]);
  return stats[0] || {};
};

const User = mongoose.model('User', userSchema);

// Usage
const user = await User.findByEmail('john@example.com');
const stats = await User.getActiveStats();
```

**Easy-Mongoo:**
```javascript
mongoo.model('User', {
  email: 'email',
  isActive: 'boolean+'
});

mongoo.static('User', 'findByEmail', async function(email) {
  return await this.findOne({ email }).populate('posts');
});

mongoo.static('User', 'getActiveStats', async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: 1 }, avgAge: { $avg: '$age' } } }
  ]);
  return stats[0] || {};
});

// Usage
const User = mongoo.getModel('User');
const user = await User.findByEmail('john@example.com');
const stats = await User.getActiveStats();
```

### Middleware (Hooks)

**Mongoose:**
```javascript
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: String,
  password: String
});

// Pre-save hook
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Post-save hook
userSchema.post('save', function(doc, next) {
  console.log(`User ${doc.email} was saved`);
  next();
});

// Pre-remove hook
userSchema.pre('remove', async function(next) {
  try {
    await Post.deleteMany({ author: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
```

**Easy-Mongoo:**
```javascript
mongoo.model('User', {
  email: 'email',
  password: 'password'
});

// Pre-save hook
mongoo.pre('User', 'save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Post-save hook
mongoo.post('User', 'save', function(doc) {
  console.log(`User ${doc.email} was saved`);
});

// Pre-remove hook
mongoo.pre('User', 'remove', async function(next) {
  await mongoo.delete('Post', { author: this._id });
  next();
});
```

### Transactions

**Mongoose:**
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  const user = new User({
    name: 'Alice',
    email: 'alice@example.com'
  });
  await user.save({ session });
  
  const post = new Post({
    title: 'First Post',
    content: 'Hello World!',
    author: user._id
  });
  await post.save({ session });
  
  await session.commitTransaction();
  console.log('Transaction successful');
} catch (error) {
  await session.abortTransaction();
  console.error('Transaction failed:', error);
  throw error;
} finally {
  session.endSession();
}
```

**Easy-Mongoo:**
```javascript
await mongoo.withTransaction(async (session) => {
  const user = await mongoo.create('User', {
    name: 'Alice',
    email: 'alice@example.com'
  }, { session });
  
  await mongoo.create('Post', {
    title: 'First Post',
    content: 'Hello World!',
    author: user._id
  }, { session });
});

// Auto commit/rollback and error handling!
```

### Aggregation

**Mongoose:**
```javascript
try {
  const stats = await User.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$country',
        totalUsers: { $sum: 1 },
        avgAge: { $avg: '$age' }
      }
    },
    { $sort: { totalUsers: -1 } }
  ]);
  
  console.log(stats);
} catch (error) {
  console.error('Aggregation error:', error);
}
```

**Easy-Mongoo:**
```javascript
const stats = await mongoo.aggregate('User', [
  { $match: { isActive: true } },
  {
    $group: {
      _id: '$country',
      totalUsers: { $sum: 1 },
      avgAge: { $avg: '$age' }
    }
  },
  { $sort: { totalUsers: -1 } }
]);

// Auto error handling!
```

### Pagination

**Mongoose:**
```javascript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

try {
  const users = await User.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('name email')
    .exec();
  
  const totalDocs = await User.countDocuments({ isActive: true });
  const totalPages = Math.ceil(totalDocs / limit);
  
  const result = {
    docs: users,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
  
  console.log(result);
} catch (error) {
  console.error('Pagination error:', error);
}
```

**Easy-Mongoo:**
```javascript
const result = await mongoo.paginate('User', 
  { isActive: true },
  { 
    page: 1,
    limit: 10,
    sort: { createdAt: -1 },
    select: 'name email'
  }
);

// Returns complete pagination object automatically!
```

### Indexes

**Mongoose:**
```javascript
const userSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ lastName: 1, firstName: 1 });
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const User = mongoose.model('User', userSchema);

// Ensure indexes are created
User.createIndexes((err) => {
  if (err) console.error('Index creation error:', err);
});

// Get indexes
User.collection.getIndexes((err, indexes) => {
  if (err) console.error(err);
  console.log(indexes);
});
```

**Easy-Mongoo:**
```javascript
mongoo.model('User', {
  email: 'email',
  firstName: 'string!',
  lastName: 'string!'
});

// Create indexes
await mongoo.index('User', { email: 1 }, { unique: true });
await mongoo.index('User', { lastName: 1, firstName: 1 });
await mongoo.index('User', { createdAt: 1 }, { expireAfterSeconds: 3600 });

// Get indexes
const indexes = await mongoo.getIndexes('User');
```

### Key Differences Summary

| Feature | Mongoose | Easy-Mongoo |
|---------|----------|-------------|
| **Setup Complexity** | Multiple steps, verbose | One-line operations |
| **Schema Definition** | Verbose object notation | Simple string shortcuts |
| **Error Handling** | Manual try-catch everywhere | Automatic |
| **Virtuals** | Manual definition required | Auto-generated common virtuals |
| **Timestamps** | Need to enable in options | Always included |
| **Method Definition** | Schema-level definition | Simple method registration |
| **Transactions** | Manual session management | Auto-managed sessions |
| **Pagination** | Manual calculation | Built-in method |
| **Learning Curve** | Steep for beginners | Gentle, intuitive |
| **Code Lines** | ~50-100 lines for basic setup | ~10-20 lines for same setup |
| **Flexibility** | Full control | Full control + convenience |

## 📈 Performance Comparison

Both Easy-Mongoo and Mongoose use the same underlying MongoDB driver, so performance is essentially identical:

- ✅ Same query execution speed
- ✅ Same connection pooling
- ✅ Same indexing capabilities
- ✅ No performance overhead from Easy-Mongoo wrapper
- ✅ Easy-Mongoo adds convenience, not latency

## 🎓 When to Use Easy-Mongoo vs Mongoose

### Choose Easy-Mongoo when:
- ✅ You want to get started quickly
- ✅ You prefer clean, minimal code
- ✅ You're building MVPs or prototypes
- ✅ You want automatic best practices
- ✅ Your team prefers simplicity
- ✅ You're new to MongoDB/Mongoose

### Choose Mongoose when:
- ✅ You need absolute fine-grained control
- ✅ You have very specific custom requirements
- ✅ You're already deeply familiar with Mongoose
- ✅ You need features not yet in Easy-Mongoo
- ✅ Your project has legacy Mongoose code

## 💡 Migration from Mongoose

Migrating from Mongoose to Easy-Mongoo is straightforward:
```javascript
// Before (Mongoose)
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});
const User = mongoose.model('User', userSchema);

// After (Easy-Mongoo)
const mongoo = require('easy-mongoo');
mongoo.model('User', {
  name: 'string!',
  email: 'email'
});

// All your existing Mongoose knowledge applies!
// Easy-Mongoo is built on top of Mongoose, not a replacement
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of the amazing [Mongoose](https://mongoosejs.com/) library
- Inspired by the need for simpler MongoDB operations
- Thanks to all contributors and users

## 📞 Support

- 📧 Email: rs@zenuxs.in
- 🐛 Issues: [GitHub Issues](https://github.com/developer-rs5/easy-mongoo/issues)
- 📖 Documentation: [https://easy-mongoo.zenuxs.in](https://easy-mongoo.zenuxs.in)
- 💬 Discord: [Join our community](https://discord.zenuxs.in)

## 🗺️ Roadmap

- [ ] TypeScript support with auto-generated types
- [ ] Built-in caching layer
- [ ] GraphQL integration
- [ ] Real-time change streams
- [ ] Advanced query builder
- [ ] Performance monitoring
- [ ] Migration tools
- [ ] CLI tools for scaffolding

---

**Made with ❤️ by developers, for developers**

**Star ⭐ this repo if you find it useful!**