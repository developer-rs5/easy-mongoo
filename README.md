# 📦 Easy-Mongoo  
### _Ultra-simple MongoDB wrapper with mongoose features in shortcut-based syntax_

Easy-Mongoo is a powerful yet beginner-friendly wrapper around MongoDB + Mongoose.  
It provides a **clean syntax**, **schema shortcuts**, **auto-error handling**, **transactions**, **middleware**, and all the features you expect — but with **10× less code**.

📖 **Full Documentation:** https://easy-mongoo.zenuxs.in  
🎨 **Schema Designer:** https://easy-mongoo.zenuxs.in/schema-design.html  

---

## 🚀 Features

- ⚡ One-line CRUD operations  
- 🛡️ Automatic error handling  
- 🧠 Smart schema shortcuts (`string!`, `number?`, `email`, `boolean+`, etc.)  
- 🔌 Simple MongoDB connection system  
- 🧩 All Mongoose features preserved  
- 🪄 Predefined templates  
- ⏱️ Auto timestamps, indexes, virtuals & more  

---

## 📥 Installation

```bash
npm install easy-mongoo
```

Import:

```js
const mongoo = require("easy-mongoo");
```

---

## 🏁 Quick Start

```js
// 1. Connect
await mongoo.connect("mongodb://localhost:27017/mydb");

// 2. Create a model using schema shortcuts
mongoo.model("User", {
  name: "string!",
  email: "email",
  age: "number?"
});

// 3. Create a document
const user = await mongoo.create("User", {
  name: "John Doe",
  email: "john@example.com",
  age: 30
});

console.log(user);
```

---

## 🔌 Connection

```js
await mongoo.connect("mongodb://localhost:27017/mydb", {
  debug: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Check status
console.log(mongoo.status());

// Disconnect
await mongoo.disconnect();
```

---

## 🧱 Schema Creation

### ✔️ Basic Schema (Shortcut System)

```js
const userSchema = {
  name: "string!",        // required string
  age: "number?",         // optional number
  isActive: "boolean+",   // boolean with default false
  tags: ["string"],       // array of strings

  address: {
    street: "string!",
    city: "string!",
    country: "string!"
  }
};
```

---

### 🧪 Advanced Schema

```js
const productSchema = {
  name: {
    type: "string",
    required: true,
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },

  price: {
    type: "number",
    required: true,
    min: [0, "Price cannot be negative"]
  },

  category: {
    type: "string",
    enum: ["Electronics", "Clothing", "Books"],
    default: "Electronics"
  },

  inStock: {
    type: "boolean",
    default: true
  }
};
```

---

### 📌 Schema Shortcuts Reference

| Shortcut | Description | Equivalent |
|---------|-------------|------------|
| `string!` | Required string | `{ type: String, required: true }` |
| `number?` | Optional number | `Number` |
| `boolean+` | Boolean with default false | `{ type: Boolean, default: false }` |
| `email` | Email validator | `{ type: String, match: emailRegex }` |
| `password` | Min length 6 | `{ type: String, minlength: 6 }` |
| `url` | URL validator | `{ type: String, match: urlRegex }` |
| `userRef` | User reference | `{ type: ObjectId, ref: "User" }` |

---

## 🧰 Models

```js
const User = mongoo.model("User", {
  firstName: "string!",
  lastName: "string!",
  email: "email",
  birthDate: "date?"
});

// Get existing model
const User = mongoo.getModel("User");
```

---

## 🔄 CRUD Operations

### ➕ Create

```js
await mongoo.create("User", {
  name: "Alice",
  email: "alice@example.com",
  age: 28
});

// Multiple
await User.create([
  { name: "Bob", email: "bob@example.com" },
  { name: "Charlie", email: "charlie@example.com" }
]);

// Find or Create
await mongoo.findOrCreate(
  "User",
  { email: "alice@example.com" },
  { name: "Alice", age: 28 }
);
```

---

### 🔍 Read

```js
await mongoo.find("User");

await mongoo.find("User", {
  isActive: true,
  age: { $gte: 18 }
});

await mongoo.findOne("User", { email: "alice@example.com" });

await mongoo.findById("User", "507f1f77bcf86cd799439011");

await mongoo.find("User", {}, {
  sort: { createdAt: -1 },
  limit: 10,
  select: "name email",
  populate: "posts"
});
```

---

### ✏️ Update

```js
await mongoo.update("User", 
  { isActive: false }, 
  { status: "inactive" }
);

await mongoo.updateById("User", "507f1...", {
  age: 29,
  lastLogin: new Date()
});

// Create or update
await mongoo.save("User", {
  _id: "507f1...",
  name: "Alice Updated",
  email: "alice.updated@example.com"
});
```

---

### ❌ Delete

```js
await mongoo.delete("User", { isActive: false });

await mongoo.deleteById("User", "507f1...");

await mongoo.exists("User", { email: "alice@example.com" });

await mongoo.count("User", { isActive: true });
```

---

## 🎨 Schema Designer  
A full, interactive schema builder is available at:

👉 https://easy-mongoo.zenuxs.in/schema-design.html  

---

## 📚 Full Documentation  
Explore all features, examples, advanced concepts, and API reference:

👉 https://easy-mongoo.zenuxs.in  

---

## 🛠️ Author  
**Developer-rs (Rishabh)**  
Made with love, MongoDB tears, and shortcuts nobody asked for ❤️

---

## ⭐ Support  
If this package saved you hours, give it a **Star** on GitHub + NPM 🌟  
