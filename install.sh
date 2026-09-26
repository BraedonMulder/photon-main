#!/bin/bash
# Setup and run photon-main
set -e -u
cd "$(dirname "$0")"

sudo sh -c 'echo "deb http://archive.debian.org/debian/ bullseye main contrib non-free" > /etc/apt/sources.list'                    # Replaces where apt looks for installation sources.

# Install pip if missing
if ! command -v pip3 >/dev/null 2>&1; then
    sudo apt update
    sudo apt install -y python3-pip
fi

# Install Python packages and start the app
pip3 install -r Requirements.txt
python3 app.py
