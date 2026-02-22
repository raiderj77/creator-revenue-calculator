#!/bin/bash
# Enable GitHub Pages for YouTube Ad Revenue Calculator

# Create a temporary JSON file
cat > /tmp/pages-config.json << EOF
{
  "source": {
    "branch": "main",
    "path": "/"
  }
}
EOF

# Enable GitHub Pages
gh api -X POST /repos/raiderj77/youtube-ad-revenue-calculator/pages --input /tmp/pages-config.json

# Clean up
rm /tmp/pages-config.json

echo "GitHub Pages enabled. Site will be at:"
echo "https://raiderj77.github.io/youtube-ad-revenue-calculator/"
echo ""
echo "Note: It may take a few minutes for the site to build and deploy."