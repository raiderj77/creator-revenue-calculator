#!/usr/bin/env python3
"""
Prepends the missing head, navbar, hero, and calculator sections
to the existing HTML fragments for each tool.
"""

import os

BASE = os.path.expanduser("~/clawbot/creator-revenue-calculator/tools")

TOOLS = {
    "instagram-revenue": {
        "body_class": "instagram",
        "title": "Instagram Revenue Calculator 2026 | How Much Do Instagram Creators Make",
        "desc": "Free Instagram revenue calculator. Estimate how much Instagram creators make from brand deals, Reels bonuses, badges, and affiliate marketing in 2026.",
        "page_title": "Instagram Revenue Calculator",
        "subtitle": "Estimate how much you can earn as an Instagram creator. Brand deals, Reels bonuses, and more — based on 2026 data.",
        "brand_color": "#e1306c",
        "logo": "Instagram Revenue Calculator",
        "stats": [
            ("$0.01–$0.05", "Per Reel View"),
            ("$100–$10K", "Brand Deal Range"),
            ("10K+", "Followers to Monetize"),
        ],
        "css": "instagram-calculator.css",
        "js": "instagram-calculator.js",
        "nav": [("Calculator", "#calculator"), ("How It Works", "#how-it-works"), ("Rates", "#rates"), ("Resources", "#resources")],
        "calc_inputs": """
                    <div class="input-group">
                        <label for="followers"><i class="fas fa-users"></i> Followers</label>
                        <div class="input-with-slider">
                            <input type="number" id="followers" min="1000" max="10000000" step="1000" value="10000">
                            <input type="range" id="followers-slider" min="1000" max="10000000" step="1000" value="10000">
                        </div>
                        <div class="input-hint">1,000 – 10,000,000 followers</div>
                    </div>
                    <div class="input-group">
                        <label for="niche"><i class="fas fa-tags"></i> Content Niche</label>
                        <select id="niche">
                            <option value="fashion">👗 Fashion & Beauty (High)</option>
                            <option value="fitness">💪 Fitness & Health (High)</option>
                            <option value="food">🍕 Food & Cooking (Medium-High)</option>
                            <option value="travel">✈️ Travel (Medium)</option>
                            <option value="lifestyle" selected>🏠 Lifestyle (Medium)</option>
                            <option value="tech">💻 Tech (Medium)</option>
                            <option value="comedy">😂 Comedy (Low-Medium)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="engagement"><i class="fas fa-chart-line"></i> Engagement Rate</label>
                        <div class="input-with-slider">
                            <input type="number" id="engagement" min="1" max="20" step="0.1" value="3">
                            <span class="percent">%</span>
                            <input type="range" id="engagement-slider" min="1" max="20" step="0.1" value="3">
                        </div>
                        <div class="input-hint">Likes + comments ÷ followers</div>
                    </div>
                    <div class="input-group">
                        <label for="posts-per-month"><i class="fas fa-calendar"></i> Posts Per Month</label>
                        <input type="number" id="posts-per-month" min="1" max="60" value="12">
                        <div class="input-hint">Including Reels, Stories, feed posts</div>
                    </div>""",
    },
    "tiktok-revenue": {
        "body_class": "tiktok",
        "title": "TikTok Revenue Calculator 2026 | How Much Do TikTokers Make",
        "desc": "Free TikTok revenue calculator. Calculate how much TikTokers make from the Creator Fund, brand deals, and live gifts in 2026.",
        "page_title": "TikTok Revenue Calculator",
        "subtitle": "Find out how much you can earn on TikTok. Creator Fund, brand deals, and live gifts — based on 2026 rates.",
        "brand_color": "#69c9d0",
        "logo": "TikTok Revenue Calculator",
        "stats": [
            ("$0.02–$0.04", "Per 1K Views"),
            ("$200–$20K", "Brand Deal Range"),
            ("10K+", "Followers for Fund"),
        ],
        "css": "tiktok-calculator.css",
        "js": "tiktok-calculator.js",
        "nav": [("Calculator", "#calculator"), ("How It Works", "#how-it-works"), ("Rates", "#rates"), ("Resources", "#resources")],
        "calc_inputs": """
                    <div class="input-group">
                        <label for="views"><i class="fas fa-eye"></i> Monthly Video Views</label>
                        <div class="input-with-slider">
                            <input type="number" id="views" min="1000" max="100000000" step="10000" value="100000">
                            <input type="range" id="views-slider" min="1000" max="100000000" step="10000" value="100000">
                        </div>
                        <div class="input-hint">1,000 – 100,000,000 views</div>
                    </div>
                    <div class="input-group">
                        <label for="niche"><i class="fas fa-tags"></i> Content Niche</label>
                        <select id="niche">
                            <option value="dance">💃 Dance & Entertainment</option>
                            <option value="comedy" selected>😂 Comedy & Skits</option>
                            <option value="education">🎓 Education & Tips</option>
                            <option value="beauty">💄 Beauty & Fashion</option>
                            <option value="food">🍕 Food & Recipes</option>
                            <option value="fitness">💪 Fitness</option>
                            <option value="finance">💰 Finance & Business</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="followers"><i class="fas fa-users"></i> Followers</label>
                        <div class="input-with-slider">
                            <input type="number" id="followers" min="0" max="10000000" step="1000" value="50000">
                            <input type="range" id="followers-slider" min="0" max="10000000" step="1000" value="50000">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="live-hours"><i class="fas fa-broadcast-tower"></i> Live Hours Per Month</label>
                        <input type="number" id="live-hours" min="0" max="200" value="4">
                        <div class="input-hint">Live gifts add significant revenue</div>
                    </div>""",
    },
    "twitch-revenue": {
        "body_class": "twitch",
        "title": "Twitch Revenue Calculator 2026 | How Much Do Twitch Streamers Make",
        "desc": "Free Twitch revenue calculator. Estimate earnings from subscriptions, bits, ads, and donations based on 2026 Twitch payout rates.",
        "page_title": "Twitch Revenue Calculator",
        "subtitle": "Calculate your Twitch earnings from subs, bits, ads, and donations — based on 2026 payout data.",
        "brand_color": "#9146ff",
        "logo": "Twitch Revenue Calculator",
        "stats": [
            ("$2.50", "Per Sub (Affiliate)"),
            ("$0.01", "Per Bit"),
            ("500", "Avg Concurrent for Partner"),
        ],
        "css": "twitch-calculator.css",
        "js": "twitch-calculator.js",
        "nav": [("Calculator", "#calculator"), ("How It Works", "#how-it-works"), ("Rates", "#rates"), ("Resources", "#resources")],
        "calc_inputs": """
                    <div class="input-group">
                        <label for="avg-viewers"><i class="fas fa-eye"></i> Average Concurrent Viewers</label>
                        <div class="input-with-slider">
                            <input type="number" id="avg-viewers" min="10" max="100000" step="10" value="100">
                            <input type="range" id="viewers-slider" min="10" max="100000" step="10" value="100">
                        </div>
                        <div class="input-hint">Your average live viewer count</div>
                    </div>
                    <div class="input-group">
                        <label for="subscribers"><i class="fas fa-star"></i> Active Subscribers</label>
                        <div class="input-with-slider">
                            <input type="number" id="subscribers" min="0" max="50000" step="10" value="50">
                            <input type="range" id="subs-slider" min="0" max="50000" step="10" value="50">
                        </div>
                        <div class="input-hint">Tier 1 subs pay ~$2.50 to you</div>
                    </div>
                    <div class="input-group">
                        <label for="stream-hours"><i class="fas fa-clock"></i> Stream Hours Per Month</label>
                        <input type="number" id="stream-hours" min="1" max="720" value="60">
                        <div class="input-hint">Affects ad revenue</div>
                    </div>
                    <div class="input-group">
                        <label for="status"><i class="fas fa-certificate"></i> Streamer Status</label>
                        <select id="status">
                            <option value="affiliate" selected>Affiliate (50% sub split)</option>
                            <option value="partner">Partner (60–70% sub split)</option>
                        </select>
                    </div>""",
    },
    "podcast-revenue": {
        "body_class": "podcast",
        "title": "Podcast Revenue Calculator 2026 | How Much Do Podcasters Make",
        "desc": "Free podcast revenue calculator. Estimate earnings from host-read ads, sponsorships, Patreon, and affiliate marketing based on your download numbers.",
        "page_title": "Podcast Revenue Calculator",
        "subtitle": "Find out how much your podcast can earn from ads, sponsorships, and listener support — based on 2026 CPM rates.",
        "brand_color": "#ff6b35",
        "logo": "Podcast Revenue Calculator",
        "stats": [
            ("$18–$50", "CPM Range"),
            ("5K+", "Downloads for Sponsors"),
            ("70%", "Host-Read Premium"),
        ],
        "css": "podcast-calculator.css",
        "js": "podcast-calculator.js",
        "nav": [("Calculator", "#calculator"), ("How It Works", "#how-it-works"), ("Rates", "#rates"), ("Resources", "#resources")],
        "calc_inputs": """
                    <div class="input-group">
                        <label for="downloads"><i class="fas fa-download"></i> Monthly Downloads (Per Episode)</label>
                        <div class="input-with-slider">
                            <input type="number" id="downloads" min="100" max="1000000" step="100" value="5000">
                            <input type="range" id="downloads-slider" min="100" max="1000000" step="100" value="5000">
                        </div>
                        <div class="input-hint">Average downloads per episode in first 30 days</div>
                    </div>
                    <div class="input-group">
                        <label for="episodes-per-month"><i class="fas fa-microphone"></i> Episodes Per Month</label>
                        <input type="number" id="episodes-per-month" min="1" max="30" value="4">
                    </div>
                    <div class="input-group">
                        <label for="niche"><i class="fas fa-tags"></i> Podcast Niche</label>
                        <select id="niche">
                            <option value="business">💼 Business & Entrepreneurship (High CPM)</option>
                            <option value="finance">💰 Finance & Investing (High)</option>
                            <option value="tech">💻 Technology (High)</option>
                            <option value="health">⚕️ Health & Wellness (Medium-High)</option>
                            <option value="education" selected>🎓 Education (Medium)</option>
                            <option value="true-crime">🔍 True Crime (Medium)</option>
                            <option value="comedy">😂 Comedy (Low-Medium)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="ad-slots"><i class="fas fa-ad"></i> Ad Slots Per Episode</label>
                        <select id="ad-slots">
                            <option value="1">1 slot (pre-roll only)</option>
                            <option value="2" selected>2 slots (pre + mid)</option>
                            <option value="3">3 slots (pre + mid + post)</option>
                        </select>
                    </div>""",
    },
    "affiliate-calculator": {
        "body_class": "affiliate",
        "title": "Affiliate Marketing Revenue Calculator 2026 | Estimate Your Earnings",
        "desc": "Free affiliate marketing calculator. Estimate commission earnings based on traffic, conversion rates, and average order value. 2026 commission data included.",
        "page_title": "Affiliate Marketing Revenue Calculator",
        "subtitle": "Calculate how much you can earn from affiliate marketing. Enter your traffic, conversion rate, and commission to see your potential income.",
        "brand_color": "#28a745",
        "logo": "Affiliate Revenue Calculator",
        "stats": [
            ("1–50%", "Commission Range"),
            ("1–5%", "Avg Conversion Rate"),
            ("$50–$200", "Avg Order Value"),
        ],
        "css": "affiliate-calculator.css",
        "js": "affiliate-calculator.js",
        "nav": [("Calculator", "#calculator"), ("How It Works", "#how-it-works"), ("Networks", "#networks"), ("Resources", "#resources")],
        "calc_inputs": """
                    <div class="input-group">
                        <label for="monthly-visitors"><i class="fas fa-users"></i> Monthly Website Visitors</label>
                        <div class="input-with-slider">
                            <input type="number" id="monthly-visitors" min="100" max="10000000" step="100" value="10000">
                            <input type="range" id="visitors-slider" min="100" max="10000000" step="100" value="10000">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="click-rate"><i class="fas fa-mouse-pointer"></i> Affiliate Link Click Rate</label>
                        <div class="input-with-slider">
                            <input type="number" id="click-rate" min="0.1" max="20" step="0.1" value="2">
                            <span class="percent">%</span>
                            <input type="range" id="click-rate-slider" min="0.1" max="20" step="0.1" value="2">
                        </div>
                        <div class="input-hint">% of visitors who click your affiliate links</div>
                    </div>
                    <div class="input-group">
                        <label for="conversion-rate"><i class="fas fa-chart-line"></i> Conversion Rate</label>
                        <div class="input-with-slider">
                            <input type="number" id="conversion-rate" min="0.1" max="20" step="0.1" value="2">
                            <span class="percent">%</span>
                            <input type="range" id="conv-slider" min="0.1" max="20" step="0.1" value="2">
                        </div>
                        <div class="input-hint">% of clicks that result in a purchase</div>
                    </div>
                    <div class="input-group">
                        <label for="avg-order"><i class="fas fa-dollar-sign"></i> Average Order Value</label>
                        <input type="number" id="avg-order" min="10" max="10000" step="5" value="75">
                        <div class="input-hint">Average purchase amount ($)</div>
                    </div>
                    <div class="input-group">
                        <label for="commission-rate"><i class="fas fa-percent"></i> Commission Rate</label>
                        <div class="input-with-slider">
                            <input type="number" id="commission-rate" min="1" max="80" step="0.5" value="8">
                            <span class="percent">%</span>
                            <input type="range" id="commission-slider" min="1" max="80" step="0.5" value="8">
                        </div>
                        <div class="input-hint">Amazon ~4%, SaaS 20–50%, digital up to 80%</div>
                    </div>""",
    },
}

HEAD_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{desc}">
    <meta property="og:title" content="{page_title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="{css}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7171402107622932" crossorigin="anonymous"></script>
</head>
<body class="{body_class}">

    <nav class="navbar">
        <div class="container">
            <a href="/" class="logo">{logo}</a>
            <div class="nav-links">
{nav_links}
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="container">
            <h1>{page_title}</h1>
            <p class="subtitle">{subtitle}</p>
            <div class="hero-stats">
{stats}
            </div>
            <div class="adsense-container">
                <div class="ad-placeholder">
                    <p>Google AdSense Ad - 728x90 or Responsive</p>
                    <small>Replace this placeholder with your AdSense code</small>
                </div>
            </div>
        </div>
    </section>

    <section id="calculator" class="calculator-section">
        <div class="container">
            <div class="section-header">
                <h2><i class="fas fa-calculator"></i> Calculate Your Earnings</h2>
                <p class="subtitle">Enter your details to estimate your revenue</p>
            </div>
            <div class="calculator-wrapper">
                <div class="input-panel">
{calc_inputs}
                    <button id="calculate-btn" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem;">
                        <i class="fas fa-calculator"></i> Calculate Earnings
                    </button>
                    <button id="reset-btn" class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:0.75rem;">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </div>

                <div class="results-panel">
                    <div class="results-card">
                        <h3><i class="fas fa-dollar-sign"></i> Estimated Earnings</h3>
                        <div class="result-row highlight">
                            <div class="result-label">Monthly Earnings:</div>
                            <div class="result-value" id="monthly-earnings">$0.00</div>
                        </div>
                        <div class="result-row annual">
                            <div class="result-label">Annual Earnings:</div>
                            <div class="result-value" id="annual-earnings">$0.00</div>
                        </div>
                        <div class="breakdown">
                            <h4><i class="fas fa-chart-pie"></i> Breakdown</h4>
                            <div class="breakdown-item">
                                <div class="breakdown-label">Daily average:</div>
                                <div class="breakdown-value" id="daily-earnings">$0.00</div>
                            </div>
                        </div>
                        <div class="disclaimer">
                            <p><i class="fas fa-info-circle"></i> <strong>Note:</strong> These are estimates based on industry averages. Actual earnings vary.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="adsense-container" style="margin-top:2rem;">
                <div class="ad-placeholder">
                    <p>Google AdSense Ad - 728x90 or Responsive</p>
                    <small>Replace this placeholder with your AdSense code</small>
                </div>
            </div>
        </div>
    </section>

"""

for tool_dir, config in TOOLS.items():
    path = os.path.join(BASE, tool_dir, "index.html")

    # Read existing fragment
    with open(path, "r") as f:
        existing = f.read()

    # Remove any existing partial head/doctype if present
    if "<!DOCTYPE" in existing or "<html" in existing:
        # Strip everything up to first <section or <div outside head
        import re
        existing = re.sub(r'^.*?(?=<section|<div class="guide)', '', existing, flags=re.DOTALL)

    # Build nav links
    nav_links = "\n".join(
        f'                <a href="{url}">{label}</a>'
        for label, url in config["nav"]
    )

    # Build stats
    stats = "\n".join(
        f'                <div class="stat"><div class="stat-number">{num}</div><div class="stat-label">{label}</div></div>'
        for num, label in config["stats"]
    )

    head = HEAD_TEMPLATE.format(
        title=config["title"],
        desc=config["desc"],
        page_title=config["page_title"],
        subtitle=config["subtitle"],
        body_class=config["body_class"],
        logo=config["logo"],
        css=config["css"],
        nav_links=nav_links,
        stats=stats,
        calc_inputs=config["calc_inputs"],
    )

    # Write complete file
    with open(path, "w") as f:
        f.write(head + existing)

    print(f"Built: {tool_dir} ({len(head + existing)} chars)")

print("\nAll done!")
