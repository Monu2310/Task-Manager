#!/bin/bash

# 🚀 Deployment Monitor Script
# Monitors the status of our Render deployment

echo "🔄 Monitoring Task Manager Deployment Status..."
echo "================================================"

BACKEND_URL="https://task-manager-backend-hzqd.onrender.com"
FRONTEND_URL="https://task-manager-frontend-fzql.vercel.app"

# Function to test endpoint with timeout
test_endpoint() {
    local url=$1
    local name=$2
    local timeout=10
    
    echo -n "Testing $name ($url)... "
    
    if response=$(curl -s --max-time $timeout "$url" 2>/dev/null); then
        if echo "$response" | jq . > /dev/null 2>&1; then
            echo "✅ HEALTHY"
            echo "Response: $response" | jq .
        else
            echo "⚠️  RESPONDING (non-JSON)"
            echo "Response: $response"
        fi
    else
        echo "❌ NOT RESPONDING"
    fi
    echo ""
}

# Function to test with retries
test_with_retries() {
    local url=$1
    local name=$2
    local max_retries=5
    local retry=1
    
    while [ $retry -le $max_retries ]; do
        echo "🔄 Attempt $retry/$max_retries:"
        test_endpoint "$url" "$name"
        
        if curl -s --max-time 10 "$url" > /dev/null 2>&1; then
            echo "✅ $name is now responding!"
            return 0
        fi
        
        if [ $retry -lt $max_retries ]; then
            echo "⏳ Waiting 30 seconds before retry..."
            sleep 30
        fi
        
        ((retry++))
    done
    
    echo "❌ $name still not responding after $max_retries attempts"
    return 1
}

# Monitor deployment
echo "🏥 Health Check Endpoints:"
test_with_retries "$BACKEND_URL/" "Backend Root"
test_with_retries "$BACKEND_URL/health" "Backend Health"

echo ""
echo "📊 API Documentation:"
test_endpoint "$BACKEND_URL/docs" "Swagger UI"

echo ""
echo "🌐 Frontend Application:"
test_endpoint "$FRONTEND_URL" "Frontend App"

echo ""
echo "🔗 Quick Links:"
echo "• Backend API: $BACKEND_URL"
echo "• Frontend App: $FRONTEND_URL"
echo "• API Docs: $BACKEND_URL/docs"
echo "• Health Check: $BACKEND_URL/health"

echo ""
echo "📝 Deployment Status Summary:"
echo "• Latest Commit: ddeb9c1 (Health endpoint + server binding fix)"
echo "• Backend Build: Fixed TypeScript compilation errors"
echo "• Server Binding: Updated to 0.0.0.0 for Render compatibility"
echo "• Health Endpoint: Added /health for monitoring"
