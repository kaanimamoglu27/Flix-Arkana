#!/bin/sh
# Kept for older instructions: the setup now lives in ios_setup.py (runs on Mac, Linux and GitHub Actions).
exec python3 "$(dirname "$0")/ios_setup.py"
