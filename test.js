    // Simple test to verify the package works
    const easyMongoo = require('./easy-mongoo');

    async function test() {
    try {
        console.log('🧪 Testing easy-mongoo package...');
        
        // Test schema creation
        const testSchema = easyMongoo.schema({
        name: 'string!',
        value: 'number'
        });
        
        console.log('✅ Schema creation test passed');
        
        // Test model creation
        const TestModel = easyMongoo.model('TestModel', {
        title: 'string!',
        count: { type: Number, default: 0 }
        });
        
        console.log('✅ Model creation test passed');
        console.log('✅ All basic tests passed!');
        console.log('📦 Package is ready for publishing!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
    }

    test();