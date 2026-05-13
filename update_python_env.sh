#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# update_python_env.sh – Upgrade Python and fix SSL/Dependency issues
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

echo "▸ Checking for Homebrew..."
if ! command -v brew &> /dev/null; then
    echo "  Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "  Homebrew found. Updating..."
    brew update
fi

echo "▸ Installing Python 3.12 (modern, stable version)..."
brew install python@3.12

BREW_PREFIX=$(brew --prefix)
PYTHON_EXE="$BREW_PREFIX/bin/python3.12"

echo "▸ Reinstalling project dependencies for Python 3.12..."
# Using the full path ensures we don't use the old system pip
"$PYTHON_EXE" -m pip install --upgrade pip
"$PYTHON_EXE" -m pip install google-cloud-firestore google-auth

echo ""
echo "✔ Upgrade complete!"
echo "✔ Python 3.12 is ready at: $PYTHON_EXE"
echo ""
echo "▸ To fix the 'DefaultCredentialsError', you MUST run:"
echo "  gcloud auth application-default login"