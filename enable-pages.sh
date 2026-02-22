#!/bin/bash
# Enable GitHub Pages for Creator Revenue Calculator

echo "Enabling GitHub Pages for creator-revenue-calculator..."

# Create a temporary JSON file for Pages configuration
cat > /tmp/pages-config.json << EOF
{
  "source": {
    "branch": "main",
    "path": "/"
  }
}
EOF

# Enable GitHub Pages
gh api -X POST /repos/raiderj77/creator-revenue-calculator/pages --input /tmp/pages-config.json

# Clean up
rm /tmp/pages-config.json

echo ""
echo "GitHub Pages enabled!"
echo ""
echo "Next steps:"
echo "1. Wait 1-2 minutes for initial build"
echo "2. Check build status: https://github.com/raiderj77/creator-revenue-calculator/actions"
echo "3. Site will be available at: https://raiderj77.github.io/creator-revenue-calculator/"
echo "4. Custom domain: creatorrevenuecalculator.com (configure in repository Settings > Pages)"
echo ""
echo "To configure custom domain:"
echo "1. Go to repository Settings > Pages"
echo "2. Under 'Custom domain', enter: creatorrevenuecalculator.com"
echo "3. Save (GitHub will create DNS records)"
echo "4. Configure DNS at your domain registrar:"
echo "   - Create A records pointing to GitHub Pages IPs:"
echo "     185.199.108.153"
echo "     185.199.109.153"
echo "     185.199.110.153"
echo "     185.199.111.153"
echo "   - OR create CNAME record: raiderj77.github.io"
echo ""
echo "Note: SSL certificate will be auto-provisioned by GitHub."