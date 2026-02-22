#!/usr/bin/env python3
"""
Add data sources CSS to all calculator HTML files.
"""

import os
import re

def add_css_to_calculator(html_file):
    """Add data sources CSS link to a calculator HTML file."""
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Check if CSS already included
    if 'data-sources.css' in content:
        return False
    
    # Find where to insert CSS (after main CSS link)
    css_pattern = r'(<link rel="stylesheet" href="[^"]+\.css">\s*)'
    matches = list(re.finditer(css_pattern, content))
    
    if not matches:
        print(f"  Warning: Could not find CSS links in {html_file}")
        return False
    
    # Insert after the last CSS link
    last_css_pos = matches[-1].end()
    
    # Add data sources CSS
    css_link = '<link rel="stylesheet" href="/assets/css/data-sources.css">\n'
    new_content = content[:last_css_pos] + css_link + content[last_css_pos:]
    
    # Write updated content back
    with open(html_file, 'w') as f:
        f.write(new_content)
    
    return True

def main():
    """Main function to add CSS to all calculators."""
    base_dir = '/home/jason-ramirez/clawbot/creator-revenue-calculator/tools'
    
    print("Adding data sources CSS to all calculators...")
    print("=" * 60)
    
    # First, copy the CSS file to assets
    css_source = os.path.join(base_dir, '..', 'tools', 'data-sources.css')
    css_dest = os.path.join(base_dir, '..', 'assets', 'css', 'data-sources.css')
    
    # Create assets/css directory if it doesn't exist
    os.makedirs(os.path.dirname(css_dest), exist_ok=True)
    
    # Copy CSS file
    with open(css_source, 'r') as src, open(css_dest, 'w') as dst:
        dst.write(src.read())
    print("✓ Copied data-sources.css to assets/css/")
    
    # Add CSS to each calculator
    calculators = [
        'youtube-ad-revenue',
        'tiktok-revenue', 
        'twitch-revenue',
        'instagram-revenue',
        'podcast-revenue',
        'affiliate-calculator'
    ]
    
    for calc in calculators:
        html_file = os.path.join(base_dir, calc, 'index.html')
        
        if os.path.exists(html_file):
            print(f"\n{calc}:")
            if add_css_to_calculator(html_file):
                print(f"  ✓ Added data sources CSS")
            else:
                print(f"  ✗ CSS already exists or failed")
        else:
            print(f"\n{calc}:")
            print(f"  ✗ HTML file not found")
    
    print("\n" + "=" * 60)
    print("CSS update complete!")

if __name__ == '__main__':
    main()