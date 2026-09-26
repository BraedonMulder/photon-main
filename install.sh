#!/bin/bash
# Setup and run photon-main
set -e -u
cd "$(dirname "$0")"

echo "Apt is not working. fixing."
sudo sh -c 'echo "deb http://archive.debian.org/debian/ bullseye main contrib non-free" > /etc/apt/sources.list'                    # Replaces where apt looks for installation sources.
sudo sh -c 'echo "deb http://archive.debian.org/debian-security/ bullseye-security main contrib non-free" >> /etc/apt/sources.list' # Appends where apt looks for security patches and bug fixes.
echo 'Acquire::Check-Valid-Until "false";' | sudo tee /etc/apt/apt.conf.d/99allow-unauthenticated                                   # Tells the OS to ignore out of date error stuff.

# Install pip if missing
if ! command -v pip3 >/dev/null 2>&1; then
    sudo apt update
    sudo apt install -y python3-pip
fi

# Install Python packages and start the app
pip3 install -r Requirements.txt
python3 app.py
