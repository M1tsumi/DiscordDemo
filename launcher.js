const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        
        .logo {
            font-size: 2.5em;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
        }
        
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        input[type="text"]:focus, input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
            margin: 10px 5px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 10px;
            font-weight: 600;
        }
        
        .status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .status.info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        
        .instructions {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            text-align: left;
        }
        
        .instructions h3 {
            color: #333;
            margin-bottom: 15px;
        }
        
        .instructions ol {
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
            color: #666;
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
            
            showStatus('Starting bot...', 'info');
            
            // Create .env file with the token
            const envContent = \`DISCORD_TOKEN=\${token}\\nBOT_PREFIX=\${prefix}\\n\`;
            
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
                    showStatus('Bot started successfully! Check your Discord server.', 'success');
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
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                
                // Write to .env file
                const envContent = `DISCORD_TOKEN=${data.token}\nBOT_PREFIX=${data.prefix || '!'}\n`;
                fs.writeFileSync('.env', envContent);
                
                // Start the bot process
                if (botProcess) {
                    botProcess.kill();
                }
                
                botProcess = spawn('npm', ['start'], {
                    stdio: 'pipe',
                    shell: true
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
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
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
