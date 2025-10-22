#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Datus Website Build & Start${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Build the project
echo -e "${YELLOW}[1/3] Building main site...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Main site built successfully${NC}"
echo ""

# Build the blog
echo -e "${YELLOW}[2/3] Building blog...${NC}"
npm run blog:build

if [ $? -ne 0 ]; then
    echo -e "${RED}Blog build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Blog built successfully${NC}"
echo ""

# Merge builds
echo -e "${YELLOW}[3/3] Merging builds...${NC}"
npm run merge:builds

if [ $? -ne 0 ]; then
    echo -e "${RED}Merge failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Builds merged successfully${NC}"
echo ""

# Start preview server
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Build completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Starting preview server...${NC}"
echo ""

# Start a simple HTTP server on port 4173
npx vite preview --port 4173
