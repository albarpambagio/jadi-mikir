#!/bin/bash
# Automated verification script for Storybook fixes

echo "=== Storybook Infinite Loading Loop Fix Verification ==="

# Test 1: Check Toast Hook Fix
echo "Test 1: Checking Toast Hook dependency array..."
if grep -q "}, \[\])" src/components/ui/use-toast.ts; then
    echo "✅ Toast Hook fixed: Empty dependency array found"
else
    echo "❌ Toast Hook issue: Dependency array not fixed"
    exit 1
fi

# Test 2: Check MainLayout Performance Monitoring Removed
echo "Test 2: Checking MainLayout performance monitoring..."
if ! grep -q "console.log.*MainLayout render" src/components/layout/main-layout.tsx; then
    echo "✅ MainLayout fixed: Performance monitoring removed"
else
    echo "❌ MainLayout issue: Performance monitoring still present"
    exit 1
fi

# Test 3: Check Store Subscription Pattern
echo "Test 3: Checking store subscription pattern..."
if grep -q "learnerStore.subscribe" src/lib/hooks/use-dashboard-stats.ts; then
    echo "✅ Store subscription implemented"
else
    echo "❌ Store subscription missing"
    exit 1
fi

# Test 4: Check Sidebar NavItem Definition
echo "Test 4: Checking Sidebar NavItem definition..."
if grep -q "const NavItem = memo" src/components/layout/sidebar.tsx; then
    echo "✅ Sidebar NavItem properly memoized"
else
    echo "❌ Sidebar NavItem not properly memoized"
    exit 1
fi

# Test 5: Run TypeScript check
echo "Test 5: Running TypeScript check..."
npx tsc --noEmit > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript check failed"
    exit 1
fi

# Test 6: Run Storybook build
echo "Test 6: Building Storybook..."
npm run build-storybook > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Storybook builds successfully"
else
    echo "❌ Storybook build failed"
    exit 1
fi

# Test 7: Run unit tests
echo "Test 7: Running unit tests..."
npm test -- --passWithNoTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Unit tests pass"
else
    echo "❌ Unit tests failed"
    exit 1
fi

echo ""
echo "=== All Verification Tests Passed! ==="
echo "Storybook infinite loading loop should be resolved."
echo ""
echo "Summary of fixes:"
echo "1. ✅ Toast Hook: Changed dependency array from [state] to []"
echo "2. ✅ MainLayout: Removed performance monitoring"
echo "3. ✅ Sidebar: Verified NavItem properly memoized"
echo "4. ✅ Store Subscription: Added proper subscription pattern"
