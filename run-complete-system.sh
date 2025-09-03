#!/bin/bash

# 🚀 Complete Event Planning System Runner
# This script sets up and runs the complete event planning system

echo "🎯 EVEA Event Planning System"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
}

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    REQUIRED_FILES=(
        "package.json"
        "src/app/plan-event/page.tsx"
        "src/components/EventTypeSelection.tsx"
        "src/components/ServiceSelection.tsx"
        "src/components/PackageSelection.tsx"
        "src/components/EventDetailsForm.tsx"
        "src/components/SchedulingForm.tsx"
        "src/components/EmailForm.tsx"
        "src/components/ConfirmationStep.tsx"
        "src/app/api/events/route.ts"
        "src/app/api/event-services/route.ts"
        "src/app/api/event-planning/route.ts"
        "src/app/api/email/send/route.ts"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "✓ $file"
        else
            print_error "✗ $file (missing)"
            MISSING_FILES=true
        fi
    done
    
    if [ "$MISSING_FILES" = true ]; then
        print_error "Some required files are missing. Please check the setup."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        print_status "Using package-lock.json for faster installation..."
        npm ci
    else
        print_status "Installing dependencies..."
        npm install
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ -f ".env.local" ]; then
        print_success "✓ .env.local file found"
        
        # Check for required environment variables
        if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && \
           grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
            print_success "✓ Required Supabase environment variables found"
        else
            print_warning "⚠ Some required environment variables may be missing"
        fi
    else
        print_warning "⚠ .env.local file not found"
        print_status "Please create .env.local with your Supabase credentials"
    fi
}

# Build the project
build_project() {
    print_status "Building the project..."
    
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Project built successfully"
    else
        print_error "Build failed. Please check for errors."
        exit 1
    fi
}

# Start the development server
start_dev_server() {
    print_status "Starting development server..."
    
    print_success "🚀 Starting EVEA Event Planning System..."
    print_status "Frontend will be available at: http://localhost:3000/plan-event"
    print_status "API endpoints will be available at: http://localhost:3000/api/*"
    echo ""
    print_warning "Press Ctrl+C to stop the server"
    echo ""
    
    npm run dev
}

# Run tests
run_tests() {
    print_status "Running system tests..."
    
    if [ -f "test-complete-event-planning.js" ]; then
        print_status "Running complete event planning test..."
        node test-complete-event-planning.js
    else
        print_warning "Test file not found. Skipping tests."
    fi
}

# Show setup instructions
show_setup_instructions() {
    echo ""
    echo "📋 SETUP INSTRUCTIONS"
    echo "====================="
    echo ""
    echo "1. 📊 Database Setup:"
    echo "   - Open your Supabase dashboard"
    echo "   - Go to SQL Editor"
    echo "   - Run: setup-complete-event-planning.sql"
    echo ""
    echo "2. 🔧 Environment Variables:"
    echo "   - Create .env.local file"
    echo "   - Add your Supabase credentials"
    echo ""
    echo "3. 🧪 Testing:"
    echo "   - Run: node test-complete-event-planning.js"
    echo "   - Verify all APIs are working"
    echo ""
    echo "4. 🌐 Access:"
    echo "   - Frontend: http://localhost:3000/plan-event"
    echo "   - API: http://localhost:3000/api/*"
    echo ""
}

# Main execution
main() {
    echo "🎯 Starting EVEA Event Planning System Setup..."
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    check_files
    check_env
    
    # Install dependencies
    install_dependencies
    
    # Build project
    build_project
    
    # Show setup instructions
    show_setup_instructions
    
    # Ask user what to do next
    echo "What would you like to do next?"
    echo "1. Start development server"
    echo "2. Run tests"
    echo "3. Show setup instructions again"
    echo "4. Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            start_dev_server
            ;;
        2)
            run_tests
            ;;
        3)
            show_setup_instructions
            ;;
        4)
            print_success "Setup complete! You can now run the system manually."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
}

# Run main function
main
