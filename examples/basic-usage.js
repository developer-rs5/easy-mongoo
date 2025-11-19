const mongoo = require('easy-mongoo');

async function basicExample() {
  try {
    // Connect
    await mongoo.connect('mongodb://localhost:27017/testdb');
    
    // Create user model
    const User = mongoo.model('User', mongoo.schemasTemplates.user);
    
    // Create product model with custom schema
    const Product = mongoo.model('Product', {
      name: 'string!',
      price: 'number!',
      category: String,
      inStock: { type: Boolean, default: true }
    });
    
    // Create a user
    const user = await mongoo.create('User', {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'secure123',
      age: 28
    });
    
    console.log('Created user:', user);
    
    // Find users
    const users = await mongoo.find('User', { age: { $gte: 25 } });
    console.log('Found users:', users.length);
    
    // Check status
    console.log('Database status:', mongoo.status());
    
  } catch (error) {
    console.error('Example error:', error);
  }
}

basicExample();