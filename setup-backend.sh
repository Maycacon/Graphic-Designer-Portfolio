#!/bin/bash

# Quick Setup Script for Backend Development

echo "🚀 Setting up Graphic Designer Portfolio Backend..."

# Create .env.local if it doesn't exist
if [ ! -f backend/.env.local ]; then
  echo "📝 Creating backend/.env.local..."
  cp backend/.env.example backend/.env.local
  echo "⚠️  Please edit backend/.env.local with your Supabase and Cloudinary credentials"
else
  echo "✅ backend/.env.local already exists"
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env.local with your credentials:"
echo "   - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY"
echo "   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
echo ""
echo "2. Create tables in Supabase:"
echo "   - Go to your Supabase project → SQL Editor"
echo "   - Create new query and paste content from backend/supabase.sql"
echo ""
echo "3. Run the backend in development:"
echo "   npm run dev"
echo ""
echo "4. Run the frontend in another terminal:"
echo "   npm run dev (from root directory)"
echo ""
echo "📚 Documentation:"
echo "   - Backend: backend/README.md"
echo "   - Deployment: DEPLOYMENT.md"
