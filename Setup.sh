#!/bin/bash
# Setup and run photon-main
set -e
cd "$(dirname "$0")"

# Install pip if missing
if ! command -v pip3 >/dev/null 2>&1; then
    sudo apt update
    sudo apt install -y python3-pip
fi



# Install Python packages and start the app
pip3 install -r Requirements.txt
python3 app.py