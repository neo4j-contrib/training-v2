#!/bin/bash
echo "Building---"
./build.sh
echo "Publishing---"
python ./publish.py
