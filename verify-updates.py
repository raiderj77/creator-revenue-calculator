#!/usr/bin/env python3
"""
Verify that all calculators have been updated with 2026 data.
"""

import os
import re

def check_file_for_2026_data(filepath, platform):
    """Check if a file contains 2026 data references."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    checks = {
        'has_2026_reference': bool(re.search(r'2026', content)),
        'has_data_sources': bool(re.search(r'data-sources-section', content)),
        'has_accurate_cpm': False,
        'has_revenue_split': False
    }
    
    # Platform-specific checks
    if platform == 'youtube':
        checks['has_accurate_cpm'] = bool(re.search(r'\$15.*\$45', content)) or bool(re.search(r'55/45', content))
        checks['has_revenue_split'] = bool(re.search(r'55/45', content)) or bool(re.search(r'0\.55', content))
    elif platform == 'tiktok':
        checks['has_accurate_cpm'] = bool(re.search(r'\$0\.02.*\$0\.04', content)) or bool(re.search(r'0\.00002', content))
    elif platform == 'twitch':
        checks['has_accurate_cpm'] = bool(re.search(r'50/50', content)) or bool(re.search(r'0\.50', content))
        checks['has_revenue_split'] = bool(re.search(r'50/50', content)) or bool(re.search(r'0\.50', content))
    elif platform == 'instagram':
        checks['has_accurate_cpm'] = bool(re.search(r'Reels.*bonus', content, re.IGNORECASE))
    elif platform == 'podcast':
        checks['has_accurate_cpm'] = bool(re.search(r'IAB', content)) or bool(re.search(r'\$18.*\$35', content))
    elif platform == 'affiliate':
        checks['has_accurate_cpm'] = bool(re.search(r'Amazon.*Associates', content)) or bool(re.search(r'commission.*rate', content, re.IGNORECASE))
    
    return checks

def main():
    """Main verification function."""
    base_dir = '/home/jason-ramirez/clawbot/creator-revenue-calculator/tools'
    
    print("Verifying 2026 data updates for all calculators...")
    print("=" * 70)
    
    platforms = [
        ('youtube-ad-revenue', 'YouTube'),
        ('tiktok-revenue', 'TikTok'),
        ('twitch-revenue', 'Twitch'),
        ('instagram-revenue', 'Instagram'),
        ('podcast-revenue', 'Podcast'),
        ('affiliate-calculator', 'Affiliate')
    ]
    
    all_passed = True
    
    for dir_name, platform_name in platforms:
        calculator_dir = os.path.join(base_dir, dir_name)
        
        if not os.path.exists(calculator_dir):
            print(f"\n{platform_name}: ✗ Directory not found")
            all_passed = False
            continue
        
        print(f"\n{platform_name}:")
        print("-" * 40)
        
        # Check HTML file
        html_file = os.path.join(calculator_dir, 'index.html')
        if os.path.exists(html_file):
            html_checks = check_file_for_2026_data(html_file, dir_name.split('-')[0])
            
            print(f"  HTML File:")
            print(f"    • 2026 reference: {'✓' if html_checks['has_2026_reference'] else '✗'}")
            print(f"    • Data sources section: {'✓' if html_checks['has_data_sources'] else '✗'}")
            print(f"    • Accurate CPM/rates: {'✓' if html_checks['has_accurate_cpm'] else '✗'}")
            print(f"    • Revenue split: {'✓' if html_checks['has_revenue_split'] else '✗'}")
            
            if not all(html_checks.values()):
                all_passed = False
        else:
            print(f"  HTML File: ✗ Not found")
            all_passed = False
        
        # Check JavaScript file
        js_files = [f for f in os.listdir(calculator_dir) if f.endswith('.js')]
        if js_files:
            js_file = os.path.join(calculator_dir, js_files[0])
            js_checks = check_file_for_2026_data(js_file, dir_name.split('-')[0])
            
            print(f"  JavaScript File ({js_files[0]}):")
            print(f"    • 2026 reference: {'✓' if js_checks['has_2026_reference'] else '✗'}")
            print(f"    • Accurate CPM/rates: {'✓' if js_checks['has_accurate_cpm'] else '✗'}")
            
            if not js_checks['has_accurate_cpm']:
                all_passed = False
        else:
            print(f"  JavaScript File: ✗ Not found")
            all_passed = False
        
        # Check data sources file
        data_sources_files = [f for f in os.listdir(calculator_dir) if 'data-sources' in f.lower() and f.endswith('.md')]
        if data_sources_files:
            print(f"  Data Sources: ✓ Found {len(data_sources_files)} file(s)")
        else:
            print(f"  Data Sources: ✗ No data sources file found")
            all_passed = False
    
    print("\n" + "=" * 70)
    
    if all_passed:
        print("✅ All calculators have been successfully updated with 2026 data!")
    else:
        print("⚠️  Some calculators need additional updates.")
        print("\nRecommended next steps:")
        print("1. Check calculators marked with ✗ for missing 2026 data")
        print("2. Verify CPM tables in HTML files match 2026 industry rates")
        print("3. Ensure revenue splits are accurate (55/45 for YouTube, 50/50 for Twitch, etc.)")
        print("4. Test calculator functionality after updates")
    
    # Check for data-sources.css
    css_file = os.path.join(base_dir, '..', 'assets', 'css', 'data-sources.css')
    if os.path.exists(css_file):
        print(f"\n📁 Data sources CSS: ✓ Found at {css_file}")
    else:
        print(f"\n📁 Data sources CSS: ✗ Not found")
        all_passed = False
    
    return all_passed

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)