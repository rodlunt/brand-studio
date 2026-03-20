#!/bin/bash
echo ""
echo "  ============================="
echo "   Brand Studio"
echo "  ============================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "  Node.js is not installed."
    echo "  Download it from https://nodejs.org"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
    echo ""
fi

# Create .env and prompt for keys if missing
if [ ! -f ".env" ]; then
    echo "  First-time setup - configure your API keys."
    echo "  You only need ONE provider. Press Enter to skip any."
    echo "  Keys are stored locally in .env and never leave your machine."
    echo ""

    read -p "  Anthropic API key (https://console.anthropic.com/settings/keys): " ANTHROPIC_KEY
    read -p "  OpenAI API key (https://platform.openai.com/api-keys): " OPENAI_KEY
    read -p "  Gemini API key (https://aistudio.google.com/apikey - free): " GEMINI_KEY

    cat > .env <<EOL
ANTHROPIC_API_KEY=${ANTHROPIC_KEY}
OPENAI_API_KEY=${OPENAI_KEY}
GEMINI_API_KEY=${GEMINI_KEY}
PORT=3000
EOL

    echo ""
    echo "  .env created. You can edit it later in any text editor."
    echo ""
fi

# Check if at least one key is set
if ! grep -q "API_KEY=." .env 2>/dev/null; then
    echo "  Warning: No API keys found in .env"
    echo "  Edit .env to add at least one provider key, then restart."
    exit 1
fi

# Start server and open browser
echo "  Starting server..."
echo "  Opening http://localhost:3000"
echo "  Press Ctrl+C to stop."
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000 &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000 &> /dev/null &
fi
node server.js
