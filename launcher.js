const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🤖 Discord Bot Manager Launcher');
console.log('================================');

// Check if Node.js is installed
exec('node --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Node.js is not installed. Please install Node.js 18+ first.');
    console.log('Download from: https://nodejs.org/');
    console.log('\nPress any key to exit...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
    return;
  }

  console.log(`✅ Node.js version: ${stdout.trim()}`);

  // Check if npm is available
  checkNpmAndInstall();
});

function checkNpmAndInstall() {
  exec('npm --version', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ npm is not found in PATH. Trying alternative methods...');
      
      // Try to find npm in common locations
      const possibleNpmPaths = [
        path.join(process.env.APPDATA, 'npm', 'npm.cmd'),
        path.join(process.env.APPDATA, 'npm', 'npm'),
        path.join(process.env.PROGRAMFILES, 'nodejs', 'npm.cmd'),
        path.join(process.env.PROGRAMFILES, 'nodejs', 'npm'),
        path.join(process.env['PROGRAMFILES(X86)'], 'nodejs', 'npm.cmd'),
        path.join(process.env['PROGRAMFILES(X86)'], 'nodejs', 'npm'),
        path.join(process.env.LOCALAPPDATA, 'npm', 'npm.cmd'),
        path.join(process.env.LOCALAPPDATA, 'npm', 'npm'),
        path.join(process.env.APPDATA, 'npm', 'npm.cmd'),
        path.join(process.env.APPDATA, 'npm', 'npm')
      ];

      let npmFound = false;
      for (const npmPath of possibleNpmPaths) {
        if (fs.existsSync(npmPath)) {
          console.log(`✅ Found npm at: ${npmPath}`);
          installDependencies(npmPath);
          npmFound = true;
          break;
        }
      }

      if (!npmFound) {
        console.error('❌ npm not found in common locations.');
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Make sure Node.js is properly installed from https://nodejs.org/');
        console.log('2. Try restarting your computer after installing Node.js');
        console.log('3. Check if npm is in your PATH environment variable');
        console.log('4. Try running: npm --version in a new command prompt');
        console.log('5. Try running: fix-npm.bat for automatic npm fixing');
        console.log('6. Try running: install-npm.bat or install-npm.ps1 for additional help');
        console.log('\n📥 If npm is still not working, try:');
        console.log('   - Reinstalling Node.js (this includes npm)');
        console.log('   - Running as administrator');
        console.log('   - Checking Windows Defender/firewall settings');
        console.log('\nPress any key to exit...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));
      }
    } else {
      console.log(`✅ npm version: ${stdout.trim()}`);
      installDependencies('npm');
    }
  });
}

function installDependencies(npmCommand) {
  // Check if dependencies are installed
  const nodeModulesPath = path.join(__dirname, 'node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    console.log(`Using npm command: ${npmCommand}`);
    
    // Try to install npm first if it's not working
    if (npmCommand === 'npm') {
      console.log('🔧 Attempting to fix npm installation...');
      
      // Try to install npm globally
      const installNpm = spawn('node', ['-e', 'require("child_process").execSync("npm install -g npm@latest", {stdio: "inherit"})'], {
        stdio: 'inherit',
        cwd: __dirname,
        shell: true,
        env: { ...process.env, PATH: process.env.PATH }
      });

      installNpm.on('close', (code) => {
        if (code === 0) {
          console.log('✅ npm installation fixed!');
          // Try the original npm install again
          runNpmInstall('npm');
        } else {
          console.log('⚠️ Could not fix npm automatically, trying alternative methods...');
          runNpmInstall('npm');
        }
      });

      installNpm.on('error', (error) => {
        console.log('⚠️ Could not fix npm automatically, trying alternative methods...');
        runNpmInstall('npm');
      });
    } else {
      runNpmInstall(npmCommand);
    }
  } else {
    console.log('✅ Dependencies already installed');
    startBotManager();
  }
}

function runNpmInstall(npmCommand) {
  const install = spawn(npmCommand, ['install'], { 
    stdio: 'inherit',
    cwd: __dirname,
    shell: true,
    env: { ...process.env, PATH: process.env.PATH }
  });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully!');
      startBotManager();
    } else {
      console.error('❌ Failed to install dependencies');
      console.log('\n🔧 Try these solutions:');
      console.log('1. Run manually: npm install');
      console.log('2. Check your internet connection');
      console.log('3. Try running as administrator');
      console.log('4. Clear npm cache: npm cache clean --force');
      console.log('5. Try running: fix-npm.bat for automatic npm fixing');
      console.log('6. Try running: install-npm.bat or install-npm.ps1 for npm help');
      console.log('7. Try running: manual-setup.bat for alternative setup');
      console.log('\nPress any key to exit...');
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', process.exit.bind(process, 0));
    }
  });

  install.on('error', (error) => {
    console.error('❌ Error running npm install:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure npm is properly installed');
    console.log('2. Try running: npm --version');
          console.log('3. Check if you have write permissions in this directory');
      console.log('4. Try running as administrator');
      console.log('5. Try running: fix-npm.bat for automatic npm fixing');
      console.log('6. Try running: install-npm.bat or install-npm.ps1 for npm help');
    console.log('6. Try running: manual-setup.bat for alternative setup');
    console.log('\nPress any key to exit...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
  });
}

function startBotManager() {
  console.log('🚀 Starting Bot Manager...');
  
  // Start the bot manager server
  const manager = spawn('node', ['bot-manager.js'], { 
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });

  // Wait a moment for the server to start
  setTimeout(() => {
    console.log('🌐 Opening browser...');
    
    // Open browser based on platform
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
      command = 'start';
    } else if (platform === 'darwin') {
      command = 'open';
    } else {
      command = 'xdg-open';
    }
    
    exec(`${command} http://localhost:3000`, (error) => {
      if (error) {
        console.log('📱 Please open your browser and go to: http://localhost:3000');
      }
    });
  }, 2000);

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    manager.kill();
    process.exit(0);
  });

  manager.on('close', (code) => {
    console.log(`\n🛑 Bot Manager stopped (code: ${code})`);
    process.exit(code);
  });

  manager.on('error', (error) => {
    console.error('❌ Error starting bot manager:', error.message);
    console.log('\nPress any key to exit...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
  });
} 