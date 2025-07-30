import { CommandHandler } from './dist/services/commandHandler.js';

console.log('Testing command loading...');

// Create a mock client
const mockClient = {
  user: { tag: 'TestBot' }
};

// Create command handler
const commandHandler = new CommandHandler(mockClient);

// Test loading commands
async function testCommands() {
  try {
    await commandHandler.loadCommands();
    console.log('✅ Command loading test completed successfully!');
  } catch (error) {
    console.error('❌ Command loading test failed:', error);
  }
}

testCommands(); 