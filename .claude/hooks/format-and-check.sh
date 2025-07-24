#!/bin/bash

echo "🔧 Running project-specific format and check..."

# Run make format
if make format; then
    echo "✅ Format completed"
else
    echo "❌ Format failed" >&2
    exit 2
fi

# Run make check
if make check; then
    echo "✅ All checks passed"
else
    echo "❌ Check failed. Please fix the issues above." >&2
    exit 2
fi

exit 0
