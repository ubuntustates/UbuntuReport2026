#!/bin/bash
# run_all_fetch_tasks.sh

# Exit immediately if a command exits with a non-zero status
set -e

# Activate the virtual environment
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "Virtual environment not found. Please create it first."
    exit 1
fi

# Run the fetch tasks inside Docker
echo "Running fetch tasks inside Docker..."
docker-compose run django python manual_tasks.py

# Deactivate virtual environment
deactivate
echo "Done."
