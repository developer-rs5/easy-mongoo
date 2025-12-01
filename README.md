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
  email: 'email!!',
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

- [Easy-Mongoo 🚀](#easy-mongoo-)
  - [✨ Features](#-features)
  - [📦 Installation](#-installation)
  - [🚀 Quick Start](#-quick-start)
  - [📖 Table of Contents](#-table-of-contents)
  - [🔌 Connection](#-connection)
  - [📝 Schema Creation](#-schema-creation)
    - [Basic Schema Shortcuts](#basic-schema-shortcuts)
    - [Schema Shortcuts Reference](#schema-shortcuts-reference)
    - [Advanced Schema with Validations](#advanced-schema-with-validations)
  - [🎨 Models](#-models)
  - [🔨 CRUD Operations](#-crud-operations)
    - [Create](#create)
    - [Read](#read)
    - [Update](#update)
    - [Delete](#delete)
  - [🆔 ID-Based Operations](#-id-based-operations)
    - [Basic ID Operations](#basic-id-operations)
    - [Update by ID](#update-by-id)
    - [Delete by ID](#delete-by-id)
    - [Upsert by ID](#upsert-by-id)
  - [📦 Batch Operations](#-batch-operations)
  - [🔧 Field-Specific Updates](#-field-specific-updates)
    - [Increment/Decrement](#incrementdecrement)
    - [Array Operations](#array-operations)
  - [🔄 Status Operations](#-status-operations)
  - [🗑️ Soft Delete Operations](#️-soft-delete-operations)
  - [🎭 Virtual Fields](#-virtual-fields)
  - [🔧 Methods \& Statics](#-methods--statics)
    - [Instance Methods](#instance-methods)
    - [Static Methods](#static-methods)
    - [Query Helpers](#query-helpers)
  - [🪝 Middleware (Hooks)](#-middleware-hooks)
    - [Pre Hooks](#pre-hooks)
    - [Post Hooks](#post-hooks)
    - [Aggregate Hooks](#aggregate-hooks)
  - [💳 Transactions](#-transactions)
    - [Basic Transaction](#basic-transaction)
    - [Transaction with Retry Logic](#transaction-with-retry-logic)
    - [Manual Session Management](#manual-session-management)
  - [📊 Aggregation](#-aggregation)
    - [Basic Aggregation](#basic-aggregation)
    - [Advanced Pipeline](#advanced-pipeline)
    - [Faceted Search](#faceted-search)
  - [🔍 Indexes](#-indexes)
  - [🔌 Plugins](#-plugins)
  - [🌟 Advanced Features](#-advanced-features)
    - [Pagination](#pagination)
    - [Bulk Operations](#bulk-operations)
    - [Text Search](#text-search)
    - [Geospatial Queries](#geospatial-queries)
    - [Data Migration](#data-migration)
    - [Seeding Data](#seeding-data)
    - [Export/Import Data](#exportimport-data)
    - [Query Explanation](#query-explanation)
    - [Caching](#caching)
  - [🎯 Predefined Templates](#-predefined-templates)
    - [User Template](#user-template)
    - [Product Template](#product-template)
    - [Post Template](#post-template)
    - [Order Template](#order-template)
  - [❌ Error Handling](#-error-handling)
  - [🐛 Debugging](#-debugging)
  - [🧰 Utility Methods](#-utility-methods)
    - [Database Operations](#database-operations)
  - [🆚 Mongoose vs Easy-Mongoo](#-mongoose-vs-easy-mongoo)
    - [Connection Comparison](#connection-comparison)
    - [Schema Definition Comparison](#schema-definition-comparison)
    - [CRUD Comparison](#crud-comparison)
    - [Key Advantages](#key-advantages)
  - [📚 Complete API Reference](#-complete-api-reference)
    - [Connection](#connection)
    - [Models](#models)
    - [Basic CRUD](#basic-crud)
    - [ID Operations](#id-operations)
    - [Batch ID Operations](#batch-id-operations)
    - [Field Updates](#field-updates)
    - [Status Operations](#status-operations)
    - [Soft Deletes](#soft-deletes)
    - [Advanced](#advanced)
    - [Transactions](#transactions)
    - [Schema Extensions](#schema-extensions)
    - [Indexes](#indexes)
    - [Data Management](#data-management)
    - [Utilities](#utilities)
    - [Properties](#properties)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [🙏 Acknowledgments](#-acknowledgments)
  - [📞 Support](#-support)
  - [🗺️ Roadmap](#️-roadmap)

## 🔌 Connection

Connect to MongoDB with automatic error handling:
```javascript
// Basic connection
await mongoo.connect('mongodb://localhost:27017/mydb');

// With options and debug mode
await mongoo.connect('mongodb://localhost:27017/mydb', {
  debug: true,
  maxPoolSize: 10,
  minPoolSize: 2
});

// Check connection status
const status = mongoo.status();
console.log(status);
// { 
//   connected: true, 
//   readyState: 'connected',
//   database: 'mydb', 
//   host: 'localhost', 
//   port: 27017,
//   models: ['User', 'Post'],
//   collections: ['users', 'posts'],
//   plugins: 2,
//   cache: 5
// }

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

| Shortcut      | Description                  | Equivalent To                                              |
|---------------|------------------------------|------------------------------------------------------------|
| `'string'`    | Basic string                 | `String`                                                   |
| `'string!'`   | Required string              | `{ type: String, required: true }`                         |
| `'string+'`   | String with default          | `{ type: String, default: '' }`                            |
| `'string!!'`  | Required & unique string     | `{ type: String, required: true, unique: true }`           |
| `'number'`    | Basic number                 | `Number`                                                   |
| `'number!'`   | Required number              | `{ type: Number, required: true }`                         |
| `'number+'`   | Number with default 0        | `{ type: Number, default: 0 }`                             |
| `'boolean'`   | Basic boolean                | `Boolean`                                                  |
| `'boolean!'`  | Required boolean             | `{ type: Boolean, required: true }`                        |
| `'boolean+'`  | Boolean with default false   | `{ type: Boolean, default: false }`                        |
| `'date'`      | Basic date                   | `Date`                                                     |
| `'date+'`     | Date with default now        | `{ type: Date, default: Date.now }`                        |
| `'array'`     | Basic array                  | `Array`                                                    |
| `'array+'`    | Array with default []        | `{ type: Array, default: [] }`                             |
| `'object'`    | Basic object                 | `Object`                                                   |
| `'object+'`   | Object with default {}       | `{ type: Object, default: {} }`                            |
| `'email'`     | Email with validation        | `{ type: String, lowercase: true, match: emailRegex }`     |
| `'email!!'`   | Required unique email        | `{ type: String, required: true, unique: true, lowercase: true, match: emailRegex }` |
| `'password'`  | Password with min length     | `{ type: String, minlength: 6 }`                           |
| `'url'`       | URL with validation          | `{ type: String, match: urlRegex }`                        |
| `'phone'`     | Phone with validation        | `{ type: String, match: phoneRegex }`                      |
| `'color'`     | Hex color with validation    | `{ type: String, match: hexColorRegex }`                   |
| `'userRef'`   | Reference to User model      | `{ type: ObjectId, ref: 'User' }`                          |
| `'postRef'`   | Reference to Post model      | `{ type: ObjectId, ref: 'Post' }`                          |
| `'productRef'`| Reference to Product model   | `{ type: ObjectId, ref: 'Product' }`                       |
| `'orderRef'`  | Reference to Order model     | `{ type: ObjectId, ref: 'Order' }`                         |
| `'categoryRef'`| Reference to Category model | `{ type: ObjectId, ref: 'Category' }`                      |
| `'point'`     | GeoJSON Point                | `{ type: { type: String, enum: ['Point'] }, coordinates: [Number] }` |
| `'location'`  | Full location object         | Address, city, country with 2dsphere coordinates           |

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
  email: 'email!!',
  birthDate: 'date?'
});

// Use predefined template
const User = mongoo.model('User', mongoo.templates.user);

// Create discriminator (inheritance)
const ClickEvent = mongoo.discriminator('Event', 'ClickEvent', {
  elementId: 'string!',
  coordinates: { x: 'number!', y: 'number!' }
});
```

**Auto-Features Included:**
- ✅ Timestamps: Automatic `createdAt` and `updatedAt` fields
- ✅ Indexes: Auto-indexing for common fields (status, category, userId, etc.)
- ✅ Virtuals: Automatic virtual fields (`id`, `fullName`, `age`, `createdAtFormatted`, etc.)
- ✅ Middleware: Auto-hooks for slugification, password hashing, soft deletes
- ✅ Validation: Smart validation with friendly messages
- ✅ Methods: Built-in instance methods (`updateFields`, `softDelete`, `toJSON`)
- ✅ Statics: Built-in static methods (`findActive`, `findDeleted`, `restore`, `findBySlug`)
- ✅ Query Helpers: Built-in query helpers (`byStatus`, `recent`, `popular`)

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

// Find with options
const users = await mongoo.find('User', {}, {
  sort: { createdAt: -1 },
  limit: 10,
  select: 'name email',
  populate: 'posts',
  lean: true
});

// Check if exists
const exists = await mongoo.exists('User', { email: 'alice@example.com' });

// Count documents
const count = await mongoo.count('User', { isActive: true });

// Get distinct values
const cities = await mongoo.distinct('User', 'city', { isActive: true });
```

### Update
```javascript
// Update multiple documents
const result = await mongoo.update('User',
  { isActive: false },
  { status: 'inactive' }
);
console.log(`Modified ${result.modifiedCount} documents`);

// Find one and update
const updatedUser = await mongoo.findOneAndUpdate('User',
  { email: 'alice@example.com' },
  { age: 29 },
  { new: true } // Return updated document
);
```

### Delete
```javascript
// Delete multiple documents
const result = await mongoo.delete('User', { isActive: false });
console.log(`Deleted ${result.deletedCount} documents`);

// Find one and delete
const deletedUser = await mongoo.findOneAndDelete('User', 
  { email: 'old@example.com' }
);
```

## 🆔 ID-Based Operations

Easy-Mongoo provides comprehensive ID-based operations with automatic error handling:

### Basic ID Operations
```javascript
// Find by ID
const user = await mongoo.findById('User', '507f1f77bcf86cd799439011');

// Find by ID with options
const user = await mongoo.findById('User', userId, {
  select: 'name email',
  populate: 'posts',
  lean: true
});

// Find by ID or throw error
const user = await mongoo.findByIdOrFail('User', userId);
// Throws error if not found

// Check if ID exists
const exists = await mongoo.existsById('User', userId);
console.log(exists); // true or false
```

### Update by ID
```javascript
// Find by ID and update (returns updated document)
const updatedUser = await mongoo.findByIdAndUpdate('User', userId, {
  age: 31,
  lastLogin: new Date()
}, {
  new: true, // Return updated document (default: true)
  runValidators: true // Run schema validators (default: true)
});

// Update by ID (returns operation result)
const result = await mongoo.updateById('User', userId, {
  age: 31
});
console.log(`Modified: ${result.modifiedCount}`);

// Update by ID or throw error
const user = await mongoo.findByIdAndUpdateOrFail('User', userId, {
  status: 'active'
});
```

### Delete by ID
```javascript
// Find by ID and delete (returns deleted document)
const deletedUser = await mongoo.findByIdAndDelete('User', userId);

// Delete by ID (returns operation result)
const result = await mongoo.deleteById('User', userId);
console.log(`Deleted: ${result.deletedCount}`);

// Delete by ID or throw error
const user = await mongoo.findByIdAndDeleteOrFail('User', userId);
```

### Upsert by ID
```javascript
// Find by ID and upsert (create if not exists)
const user = await mongoo.findByIdAndUpsert('User', userId, {
  name: 'Alice',
  email: 'alice@example.com',
  age: 28
});
// Creates new document if ID doesn't exist
// Updates existing document if ID exists
```

## 📦 Batch Operations

Perform operations on multiple documents by ID:
```javascript
// Find multiple documents by IDs
const users = await mongoo.findByIds('User', [
  '507f1f77bcf86cd799439011',
  '507f1f77bcf86cd799439012',
  '507f1f77bcf86cd799439013'
], {
  select: 'name email',
  sort: { createdAt: -1 }
});

// Update multiple documents by IDs
const result = await mongoo.updateByIds('User',
  [userId1, userId2, userId3],
  { status: 'active', lastLogin: new Date() }
);
console.log(`Modified ${result.modifiedCount} documents`);

// Delete multiple documents by IDs
const result = await mongoo.deleteByIds('User',
  [userId1, userId2, userId3]
);
console.log(`Deleted ${result.deletedCount} documents`);
```

## 🔧 Field-Specific Updates

Perform atomic updates on specific fields:

### Increment/Decrement
```javascript
// Increment a field
const user = await mongoo.findByIdAndIncrement('User', userId, 'loginCount', 1);

// Decrement a field (use negative value)
const product = await mongoo.findByIdAndIncrement('Product', productId, 'stock', -5);

// Increment multiple fields
const stats = await mongoo.findByIdAndUpdate('User', userId, {
  $inc: { loginCount: 1, points: 10 }
});
```

### Array Operations
```javascript
// Push to array
const user = await mongoo.findByIdAndPush('User', userId, 'tags', 'premium');

// Push multiple values
const user = await mongoo.findByIdAndUpdate('User', userId, {
  $push: { tags: { $each: ['premium', 'verified'] } }
});

// Pull from array
const user = await mongoo.findByIdAndPull('User', userId, 'tags', 'guest');

// Add to set (only if not exists)
const user = await mongoo.findByIdAndUpdate('User', userId, {
  $addToSet: { tags: 'premium' }
});
```

## 🔄 Status Operations

Built-in methods for common status changes:
```javascript
// Activate user
const user = await mongoo.findByIdAndActivate('User', userId);
// Sets: { isActive: true, activatedAt: new Date() }

// Deactivate user
const user = await mongoo.findByIdAndDeactivate('User', userId);
// Sets: { isActive: false, deactivatedAt: new Date() }

// Archive document
const post = await mongoo.findByIdAndArchive('Post', postId);
// Sets: { status: 'archived', archivedAt: new Date() }

// Publish document
const post = await mongoo.findByIdAndPublish('Post', postId);
// Sets: { status: 'published', publishedAt: new Date() }
```

## 🗑️ Soft Delete Operations

Implement soft deletes without physically removing data:
```javascript
// Soft delete (mark as deleted)
const user = await mongoo.findByIdAndSoftDelete('User', userId, {
  deletedBy: currentUserId // Optional: track who deleted
});
// Sets: { deleted: true, deletedAt: new Date(), deletedBy: userId }

// Restore soft-deleted document
const user = await mongoo.findByIdAndRestore('User', userId);
// Sets: { deleted: false, deletedAt: null, deletedBy: null }

// Find active (non-deleted) documents
const User = mongoo.getModel('User');
const activeUsers = await User.findActive();

// Find deleted documents
const deletedUsers = await User.findDeleted();

// Restore using static method
await User.restore(userId);
```

## 🎭 Virtual Fields

Virtual fields are computed properties that don't get stored in MongoDB:
```javascript
// Auto virtuals (already included)
// - id: String version of _id
// - fullName: firstName + lastName (if both exist)
// - age: Calculated from birthDate (if exists)
// - createdAtFormatted: Formatted createdAt date
// - updatedAtFormatted: Formatted updatedAt date

// Custom virtual field (getter only)
mongoo.virtual('User', 'profileUrl', function() {
  return `/users/${this.slug || this._id}`;
});

// Virtual with getter and setter
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
const user = await mongoo.findById('User', userId);
console.log(user.fullName); // "John Doe"
console.log(user.profileUrl); // "/users/507f1f77bcf86cd799439011"
console.log(user.age); // 30 (calculated from birthDate)

// Set via virtual
user.fullName = "Jane Smith";
console.log(user.firstName); // "Jane"
console.log(user.lastName); // "Smith"
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
const user = await mongoo.findById('User', userId);
const profile = user.getProfile();
await user.deactivate('User requested');
```

**Built-in Instance Methods:**
- `toJSON()` - Convert document to JSON with id field
- `updateFields(fields)` - Update multiple fields and save
- `softDelete()` - Mark document as deleted

### Static Methods
```javascript
// Add static method
mongoo.static('User', 'findByEmail', async function(email) {
  return await this.findOne({ email }).populate('posts');
});

// Static method with aggregation
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
const User = mongoo.getModel('User');
const user = await User.findByEmail('alice@example.com');
const stats = await User.getActiveStats();
```

**Built-in Static Methods:**
- `findActive()` - Find all non-deleted documents
- `findDeleted()` - Find all deleted documents
- `restore(id)` - Restore a soft-deleted document
- `findBySlug(slug)` - Find document by slug

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

**Built-in Query Helpers:**
- `.byStatus(status)` - Filter by status field
- `.recent(days)` - Filter by createdAt within last N days
- `.popular(minViews)` - Filter by viewCount greater than N

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

// Pre-findOneAndUpdate hook
mongoo.pre('User', 'findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
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
// Pre-aggregate hook (auto-applied to exclude deleted)
mongoo.pre('User', 'aggregate', function(next) {
  this.pipeline().unshift({ $match: { deleted: { $ne: true } } });
  next();
});
```

**Auto-Applied Middleware:**
- Auto-slugify: Generates slug from name/title field
- Auto-hash passwords: Hashes password field on save
- Auto-update timestamps: Updates `updatedAt` on findOneAndUpdate
- Logging: Logs save/remove operations
- Soft delete filter: Excludes deleted documents in aggregation

## 💳 Transactions

Execute multiple operations as a single atomic transaction:

### Basic Transaction
```javascript
// With automatic commit/rollback
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
  
  // If any operation fails, entire transaction is rolled back
});
```

### Transaction with Retry Logic
```javascript
// Automatically retry transaction on transient errors
await mongoo.withRetryTransaction(async (session) => {
  // Transfer money between accounts
  await mongoo.update(
    'Account',
    { _id: fromAccountId, balance: { $gte: 100 } },
    { $inc: { balance: -100 } },
    { session }
  );
  
  await mongoo.update(
    'Account',
    { _id: toAccountId },
    { $inc: { balance: 100 } },
    { session }
  );
}, 3); // Retry up to 3 times
```

### Manual Session Management
```javascript
const session = await mongoo.startSession();

try {
  session.startTransaction();
  
  // Your operations here
  const user = await mongoo.create('User', userData, { session });
  await mongoo.create('Post', postData, { session });
  
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

## 📊 Aggregation

Perform complex data analysis with MongoDB aggregation pipeline:

### Basic Aggregation
```javascript
// Group by category
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

// Lookup (join collections)
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
// Sales report with multiple stages
const salesReport = await mongoo.aggregate('Order', [
  // Match recent completed orders
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
  { $sort: { totalRevenue: -1 } }
]);
```

### Faceted Search
```javascript
// Multiple aggregations in one query
const facetedResults = await mongoo.aggregate('Product', [
  { $match: { price: { $lte: 1000 }, isActive: true } },
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
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ],
      // Total count
      totalCount: [{ $count: 'count' }]
    }
  }
]);
```

## 🔍 Indexes

Create and manage indexes for better query performance:
```javascript
// Create single field index
await mongoo.createIndex('User', { email: 1 });

// Create compound index
await mongoo.createIndex('User', { lastName: 1, firstName: 1 });

// Create unique index
await mongoo.createIndex('User', { email: 1 }, { unique: true });

// Create text index for full-text search
await mongoo.createIndex('Product', { name: 'text', description: 'text' });

// Create TTL index (auto-delete documents after time)
await mongoo.createIndex('Session', { createdAt: 1 }, { expireAfterSeconds: 3600 });

// Create geospatial index
await mongoo.createIndex('Location', { coordinates: '2dsphere' });

// Sync indexes (create and remove)
await mongoo.syncIndexes('User');
```

**Auto-Created Indexes:**
- Text search: name, title, description fields
- Compound: status + createdAt, category + price, userId + createdAt
- TTL: expiresAt field (if exists)
- Geospatial: location.coordinates (if exists)
- Partial: isActive (if exists)

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
    next();});
};

// Apply plugin to a specific model
mongoo.plugin('User', timestampPlugin);

// Apply plugin globally to all future models
mongoo.globalPlugin(timestampPlugin);

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
// Paginate results with full metadata
const result = await mongoo.paginate('User', 
  { isActive: true }, // filter
  { 
    page: 1, 
    limit: 10, 
    sort: { createdAt: -1 },
    select: 'name email',
    populate: 'posts'
  }
);

console.log(result);
// {
//   docs: [...], // Array of documents
//   total: 100,  // Total matching documents
//   page: 1,     // Current page
//   limit: 10,   // Items per page
//   pages: 10,   // Total pages
//   hasNext: true,  // Has next page
//   hasPrev: false  // Has previous page
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
```

### Text Search

```javascript
// Perform text search (requires text index)
const articles = await mongoo.textSearch('Article', 'mongodb database', {
  limit: 10,
  skip: 0
});
// Returns results sorted by text score
```

### Geospatial Queries

```javascript
// Find nearby locations
const nearbyStores = await mongoo.near(
  'Store',
  'location',
  [-73.97, 40.77], // [longitude, latitude]
  5000, // 5km in meters
  { limit: 10 }
);
```

### Data Migration

```javascript
// Migrate existing data
const processed = await mongoo.migrate('User', async (doc) => {
  // Transform each document
  if (!doc.slug) {
    doc.slug = doc.name.toLowerCase().replace(/\s/g, '-');
    await doc.save();
  }
}, {
  filter: { slug: { $exists: false } },
  batchSize: 100
});

console.log(`Migrated ${processed} documents`);
```

### Seeding Data

```javascript
// Seed database with initial data
await mongoo.seed('User', [
  { name: 'Admin', email: 'admin@example.com', role: 'admin' },
  { name: 'User1', email: 'user1@example.com', role: 'user' },
  { name: 'User2', email: 'user2@example.com', role: 'user' }
], {
  clearFirst: true // Clear existing data first
});
```

### Export/Import Data

```javascript
// Export data
const users = await mongoo.exportData('User', {
  filter: { isActive: true },
  fields: 'name email createdAt'
});

// Import data
await mongoo.importData('User', users);
```

### Query Explanation

```javascript
// Explain query execution plan
const explanation = await mongoo.explain('User', 'find', { isActive: true });
console.log(explanation);
// Shows index usage, execution stats, etc.
```

### Caching

```javascript
// Cache query results
const users = await mongoo.cache('User', 'active-users', async () => {
  return await mongoo.find('User', { isActive: true });
}, 3600); // Cache for 1 hour

// Clear cache
mongoo.clearCache('User:active-users');
mongoo.clearCache(); // Clear all cache
```

## 🎯 Predefined Templates

Easy-Mongoo includes ready-to-use schema templates for common use cases:

### User Template

```javascript
mongoo.model('User', mongoo.templates.user);
```

**Includes:**
- firstName, lastName (required)
- email (required, unique, validated)
- password (hashed automatically)
- avatar, birthDate, phone, bio
- isActive, isVerified (with defaults)
- role (enum: user/admin/moderator)
- permissions (array)
- loginCount, lastLogin
- settings (theme, notifications, language)
- location (address, city, country, coordinates)

### Product Template

```javascript
mongoo.model('Product', mongoo.templates.product);
```

**Includes:**
- name (required), sku (required, unique)
- description, category, tags
- price, comparePrice, cost (validated)
- inventory (quantity, tracking, allow out of stock)
- isActive, isFeatured, isDigital
- images, thumbnail
- seo (title, description, slug)
- viewCount, purchaseCount

### Post Template

```javascript
mongoo.model('Post', mongoo.templates.post);
```

**Includes:**
- title, content (required), excerpt
- author, coAuthors (user references)
- status (draft/published/archived)
- visibility (public/private/members)
- categories, tags
- featuredImage, gallery
- viewCount, likeCount, commentCount
- meta (SEO fields)

### Order Template

```javascript
mongoo.model('Order', mongoo.templates.order);
```

**Includes:**
- orderNumber (required, unique)
- status (pending/confirmed/processing/shipped/delivered/cancelled/refunded)
- customer (user reference), email
- shippingAddress (complete address object)
- items (array with product, price, quantity)
- subtotal, tax, shipping, discount, total
- paymentStatus, paymentMethod, transactionId

## ❌ Error Handling

Easy-Mongoo provides comprehensive error handling with user-friendly messages:

```javascript
try {
  await mongoo.create('User', {
    email: 'invalid-email' // Will fail validation
  });
} catch (error) {
  console.log(error.message);
  // "Validation failed: Please enter a valid email"
}
```

**Auto-Handled Error Types:**

| Error Type | Description | User-Friendly Message |
|------------|-------------|----------------------|
| ValidationError | Schema validation failed | "Validation failed: [field] is required" |
| CastError | Invalid ID format | "Invalid ID format" |
| Duplicate Key (11000) | Unique constraint violation | "[field] already exists. Please use a different value." |
| Document Not Found | ID not found | "[Model] with ID [id] not found" |

**Error Options:**

```javascript
// Don't throw error if not found
const user = await mongoo.findById('User', userId, {
  throwIfNotFound: false
});
// Returns null instead of throwing

// Using "OrFail" methods
const user = await mongoo.findByIdOrFail('User', userId);
// Always throws if not found
```

## 🐛 Debugging

Enable debugging to see detailed operation logs:

```javascript
// Enable debug mode on connect
await mongoo.connect('mongodb://localhost:27017/mydb', {
  debug: true
});

// Enable/disable anytime
mongoo.setDebug(true);  // Enable
mongoo.setDebug(false); // Disable

// Debug output examples:
// ✅ MongoDB Connected Successfully!
// 📊 Database: mydb
// 📝 Model 'User' created with auto-features
// 💾 User saved: 507f1f77bcf86cd799439011
// ✅ Created User
// 🔍 Found 10 User documents
```

## 🧰 Utility Methods

### Database Operations

```javascript
// Drop entire database
await mongoo.dropDatabase();

// Clear all collections
await mongoo.clearAll();

// Get MongoDB types
const ObjectId = mongoo.ObjectId;
const Schema = mongoo.Schema;
const Types = mongoo.Types;

// Access underlying mongoose instance
const mongoose = mongoo.mongoose;
```

## 🆚 Mongoose vs Easy-Mongoo

### Connection Comparison

**Mongoose:**
```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected'))
.catch(err => console.error('Error:', err));
```

**Easy-Mongoo:**
```javascript
const mongoo = require('easy-mongoo');
await mongoo.connect('mongodb://localhost:27017/mydb');
```

### Schema Definition Comparison

**Mongoose:**
```javascript
const userSchema = new mongoose.Schema({
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
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  age: Number,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);
```

**Easy-Mongoo:**
```javascript
mongoo.model('User', {
  firstName: 'string!',
  lastName: 'string!',
  email: 'email!!',
  age: 'number?',
  isActive: 'boolean+'
});
// fullName virtual is auto-generated!
```

### CRUD Comparison

**Mongoose (50+ lines):**
```javascript
// CREATE
const user = new User({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
});
try {
  await user.save();
} catch (error) {
  console.error('Error:', error);
}

// READ
try {
  const users = await User.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(10);
} catch (error) {
  console.error('Error:', error);
}

// UPDATE
try {
  await User.findByIdAndUpdate(userId, { age: 31 }, { new: true });
} catch (error) {
  console.error('Error:', error);
}

// DELETE
try {
  await User.findByIdAndDelete(userId);
} catch (error) {
  console.error('Error:', error);
}
```

**Easy-Mongoo (4 lines):**
```javascript
// CREATE, READ, UPDATE, DELETE with auto error handling
await mongoo.create('User', { firstName: 'John', lastName: 'Doe', email: 'john@example.com' });
const users = await mongoo.find('User', { isActive: true }, { sort: { createdAt: -1 }, limit: 10 });
await mongoo.findByIdAndUpdate('User', userId, { age: 31 });
await mongoo.findByIdAndDelete('User', userId);
```

### Key Advantages

| Feature | Mongoose | Easy-Mongoo | Improvement |
|---------|----------|-------------|-------------|
| **Lines of Code** | 100+ for basic setup | 20 for same setup | 80% reduction |
| **Schema Shortcuts** | ❌ No | ✅ Yes (30+ shortcuts) | Much faster |
| **Auto Virtuals** | ❌ Manual | ✅ Auto (fullName, age, etc.) | Time saver |
| **Auto Indexes** | ❌ Manual | ✅ Auto (text, compound, geo) | Time saver |
| **Error Handling** | ❌ Manual try-catch | ✅ Automatic | Better UX |
| **Timestamps** | ⚠️ Need to enable | ✅ Always included | Convenience |
| **Soft Deletes** | ❌ Custom plugin | ✅ Built-in methods | Productivity |
| **Pagination** | ❌ Manual calculation | ✅ One method call | Huge time saver |
| **Templates** | ❌ No | ✅ 4 ready templates | Quick start |
| **Learning Curve** | ⚠️ Steep | ✅ Gentle | Beginner friendly |

## 📚 Complete API Reference

### Connection
- `connect(uri, options)` - Connect to MongoDB
- `disconnect()` - Disconnect from MongoDB  
- `status()` - Get connection status
- `startSession()` - Start a new session

### Models
- `model(name, schema, options)` - Create model
- `discriminator(baseModel, name, schema)` - Create discriminator
- `schema(definition, options)` - Create schema

### Basic CRUD
- `create(model, data, options)` - Create document(s)
- `find(model, filter, options)` - Find documents
- `findOne(model, filter, options)` - Find one document
- `findOneAndUpdate(model, filter, data, options)` - Find and update
- `findOneAndDelete(model, filter, options)` - Find and delete
- `update(model, filter, data, options)` - Update many
- `delete(model, filter, options)` - Delete many
- `count(model, filter)` - Count documents
- `exists(model, filter)` - Check existence
- `distinct(model, field, filter)` - Get distinct values

### ID Operations
- `findById(model, id, options)` - Find by ID
- `findByIdOrFail(model, id, options)` - Find by ID or throw
- `existsById(model, id)` - Check if ID exists
- `findByIdAndUpdate(model, id, data, options)` - Update by ID
- `findByIdAndUpdateOrFail(model, id, data, options)` - Update by ID or throw
- `updateById(model, id, data, options)` - Update by ID (returns result)
- `findByIdAndDelete(model, id, options)` - Delete by ID
- `findByIdAndDeleteOrFail(model, id, options)` - Delete by ID or throw
- `deleteById(model, id, options)` - Delete by ID (returns result)
- `findByIdAndUpsert(model, id, data, options)` - Upsert by ID

### Batch ID Operations
- `findByIds(model, ids, options)` - Find multiple by IDs
- `updateByIds(model, ids, data, options)` - Update multiple by IDs
- `deleteByIds(model, ids, options)` - Delete multiple by IDs

### Field Updates
- `findByIdAndIncrement(model, id, field, value, options)` - Increment field
- `findByIdAndPush(model, id, field, value, options)` - Push to array
- `findByIdAndPull(model, id, field, value, options)` - Pull from array

### Status Operations
- `findByIdAndActivate(model, id, options)` - Activate document
- `findByIdAndDeactivate(model, id, options)` - Deactivate document
- `findByIdAndArchive(model, id, options)` - Archive document
- `findByIdAndPublish(model, id, options)` - Publish document

### Soft Deletes
- `findByIdAndSoftDelete(model, id, options)` - Soft delete
- `findByIdAndRestore(model, id, options)` - Restore deleted

### Advanced
- `aggregate(model, pipeline, options)` - Run aggregation
- `paginate(model, filter, options)` - Paginate results
- `textSearch(model, text, options)` - Text search
- `near(model, field, coords, distance, options)` - Geospatial query
- `bulkWrite(model, operations, options)` - Bulk operations

### Transactions
- `withTransaction(callback)` - Execute transaction
- `withRetryTransaction(callback, maxRetries)` - Transaction with retry

### Schema Extensions
- `virtual(model, name, getter, setter)` - Add virtual
- `method(model, name, fn)` - Add instance method
- `static(model, name, fn)` - Add static method
- `query(model, name, fn)` - Add query helper
- `pre(model, hook, fn)` - Add pre hook
- `post(model, hook, fn)` - Add post hook
- `plugin(model, plugin, options)` - Add plugin
- `globalPlugin(plugin, options)` - Add global plugin

### Indexes
- `createIndex(model, fields, options)` - Create index
- `syncIndexes(model)` - Sync indexes

### Data Management
- `migrate(model, fn, options)` - Migrate data
- `seed(model, data, options)` - Seed data
- `exportData(model, options)` - Export data
- `importData(model, data, options)` - Import data

### Utilities
- `explain(model, operation, ...args)` - Query explanation
- `cache(model, key, fn, ttl)` - Cache results
- `clearCache(pattern)` - Clear cache
- `setDebug(enabled)` - Enable/disable debug
- `dropDatabase()` - Drop database
- `clearAll()` - Clear all collections

### Properties
- `mongoose` - Access mongoose instance
- `ObjectId` - MongoDB ObjectId type
- `Schema` - Mongoose Schema class
- `Types` - Mongoose Types
- `templates` - Predefined schema templates (user, product, post, order)

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
- [ ] Redis caching integration
- [ ] GraphQL adapter
- [ ] Real-time change streams API
- [ ] Advanced query builder UI
- [ ] Performance monitoring dashboard
- [ ] Database migration CLI
- [ ] Visual schema designer

---

**Made with ❤️ by developers, for developers**

**Star ⭐ this repo if you find it useful!**
```