#!/bin/bash

# Skedify Development Setup Script

echo "🚀 Setting up Skedify for development..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo "❌ Deno is not installed. Please install Deno: https://deno.land/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js: https://nodejs.org/"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm: https://pnpm.io/"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL: https://postgresql.org/"
    exit 1
fi

echo "✅ All prerequisites are installed!"

# Copy environment files
echo "📄 Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
else
    echo "⚠️  .env already exists, skipping..."
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env from frontend/.env.example"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && pnpm install
cd ..

echo "🎉 Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Create a PostgreSQL database named 'skedify'"
echo "2. Run the database schema: psql -d skedify -f database/schema.sql"
echo "3. Update your .env file with your database credentials"
echo "4. Start the backend: cd backend && deno task dev"
echo "5. Start the frontend: cd frontend && pnpm dev"
echo ""
echo "📱 The application will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo ""
echo "Happy coding! 🎊"