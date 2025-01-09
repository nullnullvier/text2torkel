#!/bin/sh
set -eux

sudo apt update
sudo apt upgrade
sudo apt-get install libportaudio2

# Audio (Ref: https://stackoverflow.com/a/78750928/)
# Specified device number in file is obtained via `aplay -l` on host.
sudo cp -v ./.devcontainer/asound.conf /etc/asound.conf  
sudo apt -y install alsa-utils acl
sudo usermod -aG audio $USER

# Without this, sudo is required when using ffplay to access /dev/snd/*, 
# as the above usermod command is not expected to take effect until a restart.
sudo setfacl -m u:$USER:rw /dev/snd/*

# install python requirements
cd api
pip3 install -r requirements.txt

# install special requirement for sound
pip3 install sounddevice
echo "Finished setting up devcontainer."