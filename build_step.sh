#!/bin/bash

echo "Build script"

npm run install:pipeline

echo "Install complete"

npm run build:pipeline

echo "Build complete"
