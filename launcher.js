import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 3000;

// HTML template for the bot manager
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discord Bot Manager</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
        }
        
        body::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
            animation: shine 8s ease-in-out infinite;
            pointer-events: none;
        }
        
        @keyframes shine {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            50% { transform: translate(-50%, -50%) rotate(180deg); }
        }
        
        .container {
            background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.8),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05);
            text-align: center;
            max-width: 500px;
            width: 90%;
            position: relative;
            backdrop-filter: blur(10px);
        }
        
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 20px;
            padding: 1px;
            background: linear-gradient(145deg, rgba(255,255,255,0.1), transparent);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
        }
        
        .logo {
            font-size: 2.5em;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 20px;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            letter-spacing: 2px;
        }
        
        .subtitle {
            color: #888888;
            margin-bottom: 30px;
            font-size: 1.1em;
            letter-spacing: 1px;
        }
        
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #cccccc;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #333333;
            border-radius: 10px;
            font-size: 16px;
            background: #1a1a1a;
            color: #ffffff;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        input[type="text"]:focus, input[type="password"]:focus {
            outline: none;
            border-color: #666666;
            box-shadow: 
                inset 0 2px 4px rgba(0, 0, 0, 0.3),
                0 0 0 3px rgba(255, 255, 255, 0.1);
        }
        
        input[type="text"]::placeholder, input[type="password"]::placeholder {
            color: #666666;
        }
        
        .btn {
            background: linear-gradient(145deg, #333333, #1a1a1a);
            color: #ffffff;
            border: 1px solid #444444;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px 5px;
            box-shadow: 
                0 4px 8px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 6px 12px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            background: linear-gradient(145deg, #444444, #2a2a2a);
        }
        
        .btn:active {
            transform: translateY(0);
            box-shadow: 
                0 2px 4px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        .status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 10px;
            font-weight: 600;
            border: 1px solid;
        }
        
        .status.success {
            background: linear-gradient(145deg, #1a2a1a, #0d1a0d);
            color: #88cc88;
            border-color: #2a4a2a;
        }
        
        .status.error {
            background: linear-gradient(145deg, #2a1a1a, #1a0d0d);
            color: #cc8888;
            border-color: #4a2a2a;
        }
        
        .status.info {
            background: linear-gradient(145deg, #1a1a2a, #0d0d1a);
            color: #8888cc;
            border-color: #2a2a4a;
        }
        
        .instructions {
            margin-top: 30px;
            padding: 20px;
            background: linear-gradient(145deg, #0d0d0d, #1a1a1a);
            border-radius: 10px;
            text-align: left;
            border: 1px solid #333333;
        }
        
        .instructions h3 {
            color: #cccccc;
            margin-bottom: 15px;
            letter-spacing: 1px;
        }
        
        .instructions ol {
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
            color: #888888;
            line-height: 1.5;
        }
        
        .instructions a {
            color: #aaaaaa;
            text-decoration: none;
            border-bottom: 1px solid #666666;
            transition: color 0.3s ease;
        }
        
        .instructions a:hover {
            color: #ffffff;
            border-bottom-color: #ffffff;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🎮 Discord Bot</div>
        <div class="subtitle">Bot Manager & Configuration</div>
        
        <form id="botForm">
            <div class="form-group">
                <label for="botToken">Discord Bot Token:</label>
                <input type="password" id="botToken" name="botToken" placeholder="Enter your Discord bot token" required>
            </div>
            
            <div class="form-group">
                <label for="botPrefix">Bot Prefix (optional):</label>
                <input type="text" id="botPrefix" name="botPrefix" placeholder="!" value="!">
            </div>
            
            <button type="submit" class="btn">🚀 Start Bot</button>
            <button type="button" class="btn" onclick="stopBot()">⏹️ Stop Bot</button>
        </form>
        
        <div id="status" class="status" style="display: none;"></div>
        
        <div class="instructions">
            <h3>📋 Setup Instructions:</h3>
            <ol>
                <li>Get your bot token from the <a href="https://discord.com/developers/applications" target="_blank">Discord Developer Portal</a></li>
                <li>Enter your bot token above</li>
                <li>Click "Start Bot" to launch your bot</li>
                <li>Your bot will be available in your Discord servers</li>
            </ol>
        </div>
    </div>
    
    <script>
        let botProcess = null;
        
        document.getElementById('botForm').addEventListener('submit', function(e) {
            e.preventDefault();
            startBot();
        });
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + type;
            status.style.display = 'block';
        }
        
        function startBot() {
            const token = document.getElementById('botToken').value;
            const prefix = document.getElementById('botPrefix').value || '!';
            
            if (!token) {
                showStatus('Please enter a bot token', 'error');
                return;
            }
            
            showStatus('Installing dependencies and building project... This may take a few minutes.', 'info');
            
            fetch('/start-bot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    prefix: prefix
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showStatus('Bot started successfully! Check your Discord server. You should see your bot online now.', 'success');
                } else {
                    showStatus('Failed to start bot: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showStatus('Error starting bot: ' + error.message, 'error');
            });
        }
        
        function stopBot() {
            if (botProcess) {
                fetch('/stop-bot', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showStatus('Bot stopped successfully', 'success');
                        botProcess = null;
                    } else {
                        showStatus('Failed to stop bot: ' + data.error, 'error');
                    }
                })
                .catch(error => {
                    showStatus('Error stopping bot: ' + error.message, 'error');
                });
            } else {
                showStatus('No bot is currently running', 'info');
            }
        }
    </script>
</body>
</html>
`;

let botProcess = null;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/') {
        res.writeHead(200);
        res.end(htmlTemplate);
    } else if (req.url === '/start-bot' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                
                // Write to .env file
                const envContent = `DISCORD_TOKEN=${data.token}\nBOT_PREFIX=${data.prefix || '!'}\n`;
                fs.writeFileSync('.env', envContent);
                
                // Stop any existing bot process
                if (botProcess) {
                    botProcess.kill();
                    botProcess = null;
                }
                
                // First, install dependencies if node_modules doesn't exist
                if (!fs.existsSync('node_modules')) {
                    console.log('Installing dependencies...');
                    const installProcess = spawn('npm', ['install'], {
                        stdio: 'pipe',
                        shell: true
                    });
                    
                    installProcess.stdout.on('data', (data) => {
                        console.log('Install output:', data.toString());
                    });
                    
                    installProcess.stderr.on('data', (data) => {
                        console.error('Install error:', data.toString());
                    });
                    
                    await new Promise((resolve, reject) => {
                        installProcess.on('close', (code) => {
                            if (code === 0) {
                                console.log('Dependencies installed successfully');
                                resolve();
                            } else {
                                reject(new Error(`npm install failed with code ${code}`));
                            }
                        });
                    });
                }
                
                // Build the project
                console.log('Building project...');
                const buildProcess = spawn('npm', ['run', 'build'], {
                    stdio: 'pipe',
                    shell: true
                });
                
                buildProcess.stdout.on('data', (data) => {
                    console.log('Build output:', data.toString());
                });
                
                buildProcess.stderr.on('data', (data) => {
                    console.error('Build error:', data.toString());
                });
                
                // Try to build, but don't fail if it doesn't work
                try {
                    await new Promise((resolve, reject) => {
                        buildProcess.on('close', (code) => {
                            if (code === 0) {
                                console.log('Project built successfully');
                                resolve();
                            } else {
                                console.log('Build failed, but continuing with ts-node...');
                                resolve(); // Don't reject, just continue
                            }
                        });
                    });
                } catch (error) {
                    console.log('Build error, but continuing with ts-node...');
                }
                
                // Start the bot process with ts-node for development
                console.log('Starting bot with ts-node...');
                botProcess = spawn('npx', ['ts-node', 'src/index.ts'], {
                    stdio: 'pipe',
                    shell: true,
                    env: { ...process.env, DISCORD_TOKEN: data.token, BOT_PREFIX: data.prefix || '!' }
                });
                
                botProcess.stdout.on('data', (data) => {
                    console.log('Bot output:', data.toString());
                });
                
                botProcess.stderr.on('data', (data) => {
                    console.error('Bot error:', data.toString());
                });
                
                botProcess.on('close', (code) => {
                    console.log('Bot process exited with code:', code);
                    botProcess = null;
                });
                
                // Wait a moment to see if the bot starts successfully
                setTimeout(() => {
                    if (botProcess && !botProcess.killed) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Bot started successfully!' }));
                    } else {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Bot failed to start' }));
                    }
                }, 2000);
                
            } catch (error) {
                console.error('Error starting bot:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    } else if (req.url === '/stop-bot' && req.method === 'POST') {
        if (botProcess) {
            botProcess.kill();
            botProcess = null;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'No bot running' }));
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`🎮 Discord Bot Manager running at http://localhost:${PORT}`);
    console.log('📱 Open your browser and navigate to the URL above');
    console.log('🔄 Press Ctrl+C to stop the manager');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down bot manager...');
    if (botProcess) {
        botProcess.kill();
    }
    server.close(() => {
        console.log('✅ Bot manager stopped');
        process.exit(0);
    });
}); 
