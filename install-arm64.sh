#!/bin/bash
# Setup and run photon-main
set -e

cd "$(dirname "$0")"

sudo apt update
sudo apt install -y python3-pip python3-venv

python3 -m venv venv
source venv/bin/activate

pip install -r Requirements.txt

python app.py