#!/bin/bash

echo "==========================================="
echo "DISCORD BOT SETUP SCRIPT"
echo "==========================================="
echo

echo "Installing dependencies..."
npm install

echo
echo "Creating .env file from template..."
if [ ! -f .env ]; then
    cp env.template .env
    echo "Created .env file from template"
    echo "Please edit .env with your Discord bot token"
else
    echo ".env file already exists"
fi

echo
echo "Creating data directory..."
if [ ! -d data ]; then
    mkdir data
    echo "Created data directory"
fi

echo
echo "Building project..."
npm run build

echo
echo "==========================================="
echo "SETUP COMPLETE!"
echo "==========================================="
echo
echo "Next steps:"
echo "1. Edit .env file with your Discord bot token"
echo "2. Run 'npm start' to start the bot"
echo "3. For development, use 'npm run dev'"
echo
echo "For help, contact @quefep on Discord"
echo 