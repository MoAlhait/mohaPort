#!/bin/bash

# Focus Lock - Quick Deploy Script
# This script provides a quick way to build and deploy Focus Lock

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WEB_APP_DIR="$(dirname "$PROJECT_ROOT")"
VERSION=$(node -p "require('$PROJECT_ROOT/package.json').version")
BUILD_ID="build-$(date +%s)"

# Default options
PLATFORM="all"
ENVIRONMENT="production"
SKIP_TESTS=false
SKIP_BUILD=false
DEPLOY=false
HELP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--platform)
            PLATFORM="$2"
            shift 2
            ;;
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -d|--deploy)
            DEPLOY=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -h|--help)
            HELP=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Show help
if [ "$HELP" = true ]; then
    echo "Focus Lock - Quick Deploy Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --platform PLATFORM    Target platform (win|mac|linux|all) [default: all]"
    echo "  -e, --environment ENV      Environment (development|staging|production) [default: production]"
    echo "  -d, --deploy               Deploy after building"
    echo "  --skip-tests              Skip running tests"
    echo "  --skip-build              Skip building (use existing build)"
    echo "  -h, --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                        # Build for all platforms"
    echo "  $0 -p win -d              # Build for Windows and deploy"
    echo "  $0 -e development         # Build for development environment"
    echo "  $0 --skip-tests -d        # Build and deploy without tests"
    exit 0
fi

log_header "Focus Lock Quick Deploy"
echo "Version: $VERSION"
echo "Build ID: $BUILD_ID"
echo "Platform: $PLATFORM"
echo "Environment: $ENVIRONMENT"
echo "Deploy: $DEPLOY"
echo ""

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ required (found: $(node --version))"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed"
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "$PROJECT_ROOT/package.json" ]; then
        log_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Install web app dependencies
    if [ -f "$WEB_APP_DIR/package.json" ]; then
        log_info "Installing web app dependencies..."
        cd "$WEB_APP_DIR"
        npm install
    fi
    
    # Install Electron dependencies
    log_info "Installing Electron dependencies..."
    cd "$PROJECT_ROOT"
    npm install
    
    log_success "Dependencies installed"
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        log_warning "Skipping tests"
        return
    fi
    
    log_info "Running tests..."
    
    cd "$WEB_APP_DIR"
    if npm run lint; then
        log_success "Linting passed"
    else
        log_error "Linting failed"
        exit 1
    fi
    
    log_success "Tests completed"
}

# Build web app
build_web_app() {
    log_info "Building web application..."
    
    cd "$WEB_APP_DIR"
    
    # Clean previous build
    if [ -d "out" ]; then
        rm -rf out
    fi
    
    # Build
    if npm run build; then
        log_success "Web app built successfully"
    else
        log_error "Web app build failed"
        exit 1
    fi
}

# Build desktop app
build_desktop_app() {
    if [ "$SKIP_BUILD" = true ]; then
        log_warning "Skipping build (using existing build)"
        return
    fi
    
    log_info "Building desktop application..."
    
    cd "$PROJECT_ROOT"
    
    # Copy web app build to Electron
    if [ -d "out" ]; then
        rm -rf out
    fi
    
    if [ -d "$WEB_APP_DIR/out" ]; then
        cp -r "$WEB_APP_DIR/out" .
        log_success "Web app copied to Electron directory"
    else
        log_error "Web app build not found"
        exit 1
    fi
    
    # Build based on platform
    case $PLATFORM in
        "win"|"windows")
            log_info "Building for Windows..."
            npm run build-win
            ;;
        "mac"|"macos")
            log_info "Building for macOS..."
            npm run build-mac
            ;;
        "linux")
            log_info "Building for Linux..."
            npm run build
            ;;
        "all")
            log_info "Building for all platforms..."
            npm run build-win
            npm run build-mac
            npm run build
            ;;
        *)
            log_error "Unknown platform: $PLATFORM"
            exit 1
            ;;
    esac
    
    log_success "Desktop app built successfully"
}

# Create distribution packages
create_packages() {
    log_info "Creating distribution packages..."
    
    cd "$PROJECT_ROOT"
    
    # Run the complete build script
    if node scripts/build-all.js; then
        log_success "Distribution packages created"
    else
        log_error "Package creation failed"
        exit 1
    fi
}

# Deploy
deploy_app() {
    if [ "$DEPLOY" != true ]; then
        log_info "Deploy skipped (use -d flag to deploy)"
        return
    fi
    
    log_info "Deploying application..."
    
    cd "$PROJECT_ROOT"
    
    # Set environment variables
    export NODE_ENV="$ENVIRONMENT"
    export BUILD_ID="$BUILD_ID"
    
    # Run deployment script
    if node scripts/deploy.js; then
        log_success "Deployment completed"
    else
        log_error "Deployment failed"
        exit 1
    fi
}

# Generate summary
generate_summary() {
    log_info "Generating deployment summary..."
    
    echo ""
    log_header "Deployment Summary"
    echo "Version: $VERSION"
    echo "Build ID: $BUILD_ID"
    echo "Platform: $PLATFORM"
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $(date)"
    echo ""
    
    # Show build artifacts
    if [ -d "$PROJECT_ROOT/dist" ]; then
        echo "Build artifacts:"
        find "$PROJECT_ROOT/dist" -name "*.exe" -o -name "*.dmg" -o -name "*.AppImage" | while read -r file; do
            size=$(du -h "$file" | cut -f1)
            echo "  $(basename "$file") ($size)"
        done
    fi
    
    echo ""
    log_success "Quick deploy completed successfully!"
    
    if [ "$DEPLOY" = true ]; then
        echo ""
        echo "Next steps:"
        echo "1. Test installers on target platforms"
        echo "2. Verify web deployment"
        echo "3. Update documentation"
        echo "4. Notify users of new release"
    fi
}

# Main execution
main() {
    # Change to script directory
    cd "$SCRIPT_DIR"
    
    # Run all steps
    check_prerequisites
    install_dependencies
    run_tests
    build_web_app
    build_desktop_app
    create_packages
    deploy_app
    generate_summary
}

# Run main function
main "$@"
