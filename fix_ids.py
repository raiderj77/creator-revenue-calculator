#!/usr/bin/env python3
"""
Replaces the calculator-wrapper section in each tool's index.html
with correct input/output IDs that match the existing JS files.
"""
import os, re

BASE = os.path.expanduser("~/clawbot/creator-revenue-calculator/tools")

CALCULATORS = {

"instagram-revenue": """
            <div class="calculator-wrapper">
                <div class="input-panel">
                    <div class="input-group">
                        <label for="followers"><i class="fas fa-users"></i> Followers</label>
                        <div class="input-with-slider">
                            <input type="number" id="followers" min="1000" max="10000000" step="1000" value="10000">
                            <input type="range" id="followers-slider" min="1000" max="10000000" step="1000" value="10000">
                        </div>
                        <div class="input-hint">1,000 – 10,000,000 followers</div>
                    </div>
                    <div class="input-group">
                        <label for="engagementRate"><i class="fas fa-chart-line"></i> Engagement Rate</label>
                        <div class="input-with-slider">
                            <input type="number" id="engagementRate" min="0.1" max="20" step="0.1" value="3">
                            <span class="percent">%</span>
                            <input type="range" id="engagement-slider" min="0.1" max="20" step="0.1" value="3">
                        </div>
                        <div class="input-hint">Likes + comments ÷ followers × 100</div>
                    </div>
                    <div class="input-group">
                        <label for="postsPerWeek"><i class="fas fa-image"></i> Feed Posts Per Week</label>
                        <input type="number" id="postsPerWeek" min="0" max="21" step="1" value="3">
                    </div>
                    <div class="input-group">
                        <label for="reelsPerWeek"><i class="fas fa-film"></i> Reels Per Week</label>
                        <input type="number" id="reelsPerWeek" min="0" max="21" step="1" value="3">
                    </div>
                    <div class="input-group">
                        <label for="liveHours"><i class="fas fa-broadcast-tower"></i> Live Hours Per Month</label>
                        <input type="number" id="liveHours" min="0" max="200" step="1" value="4">
                    </div>
                    <div class="input-group">
                        <label for="niche"><i class="fas fa-tags"></i> Content Niche</label>
                        <select id="niche">
                            <option value="fashion">👗 Fashion & Beauty</option>
                            <option value="fitness">💪 Fitness & Health</option>
                            <option value="food">🍕 Food & Cooking</option>
                            <option value="travel">✈️ Travel</option>
                            <option value="lifestyle" selected>🏠 Lifestyle</option>
                            <option value="tech">💻 Tech</option>
                            <option value="comedy">😂 Comedy</option>
                        </select>
                    </div>
                    <button id="calculateBtn" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem;">
                        <i class="fas fa-calculator"></i> Calculate Earnings
                    </button>
                </div>
                <div class="results-panel">
                    <div class="results-card">
                        <h3><i class="fas fa-dollar-sign"></i> Estimated Monthly Earnings</h3>
                        <div class="result-row">
                            <div class="result-label">Brand Deals:</div>
                            <div class="result-value" id="brandDeals">$0.00</div>
                        </div>
                        <div id="brandDealsDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Reels Bonus:</div>
                            <div class="result-value" id="reelsBonus">$0.00</div>
                        </div>
                        <div id="reelsBonusDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Live Badges:</div>
                            <div class="result-value" id="badgeIncome">$0.00</div>
                        </div>
                        <div id="badgeIncomeDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Affiliate Revenue:</div>
                            <div class="result-value" id="affiliateRevenue">$0.00</div>
                        </div>
                        <div id="affiliateRevenueDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row highlight">
                            <div class="result-label">Total Monthly:</div>
                            <div class="result-value" id="totalEarnings">$0.00</div>
                        </div>
                        <div id="totalDetail" class="input-hint"></div>
                        <div class="breakdown">
                            <h4>Per Metric</h4>
                            <div class="breakdown-item"><div class="breakdown-label">Per follower:</div><div class="breakdown-value" id="perFollower">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per post:</div><div class="breakdown-value" id="perPost">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per reel:</div><div class="breakdown-value" id="perReel">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Engagement multiplier:</div><div class="breakdown-value" id="engagementMultiplier">1x</div></div>
                        </div>
                        <div class="disclaimer"><p><i class="fas fa-info-circle"></i> Estimates based on 2026 industry averages. Actual earnings vary.</p></div>
                    </div>
                </div>
            </div>""",

"tiktok-revenue": """
            <div class="calculator-wrapper">
                <div class="input-panel">
                    <div class="input-group">
                        <label for="views"><i class="fas fa-eye"></i> Monthly Video Views</label>
                        <div class="input-with-slider">
                            <input type="number" id="views" min="1000" max="100000000" step="10000" value="100000">
                            <input type="range" id="views-slider" min="1000" max="100000000" step="10000" value="100000">
                        </div>
                        <div class="input-hint">Total views across all videos this month</div>
                    </div>
                    <div class="input-group">
                        <label for="followers"><i class="fas fa-users"></i> Followers</label>
                        <div class="input-with-slider">
                            <input type="number" id="followers" min="0" max="10000000" step="1000" value="50000">
                            <input type="range" id="followers-slider" min="0" max="10000000" step="1000" value="50000">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="niche"><i class="fas fa-tags"></i> Content Niche</label>
                        <select id="niche">
                            <option value="dance">💃 Dance & Entertainment</option>
                            <option value="comedy" selected>😂 Comedy & Skits</option>
                            <option value="education">🎓 Education</option>
                            <option value="beauty">💄 Beauty & Fashion</option>
                            <option value="food">🍕 Food</option>
                            <option value="fitness">💪 Fitness</option>
                            <option value="finance">💰 Finance</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="frequency"><i class="fas fa-calendar"></i> Videos Per Week</label>
                        <input type="number" id="frequency" min="1" max="50" step="1" value="5">
                    </div>
                    <div class="input-group">
                        <label for="engagement"><i class="fas fa-heart"></i> Engagement Rate</label>
                        <div class="input-with-slider">
                            <input type="number" id="engagement" min="0.1" max="20" step="0.1" value="5">
                            <span class="percent">%</span>
                            <input type="range" id="engagement-slider" min="0.1" max="20" step="0.1" value="5">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="liveHours"><i class="fas fa-broadcast-tower"></i> Live Hours Per Month</label>
                        <input type="number" id="liveHours" min="0" max="200" step="1" value="4">
                        <div class="input-hint">Live gifts add significant revenue</div>
                    </div>
                    <button id="calculateBtn" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem;">
                        <i class="fas fa-calculator"></i> Calculate Earnings
                    </button>
                </div>
                <div class="results-panel">
                    <div class="results-card">
                        <h3><i class="fas fa-dollar-sign"></i> Estimated Monthly Earnings</h3>
                        <div class="result-row">
                            <div class="result-label">Creator Fund:</div>
                            <div class="result-value" id="creatorFund">$0.00</div>
                        </div>
                        <div id="creatorFundDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Brand Deals:</div>
                            <div class="result-value" id="brandDeals">$0.00</div>
                        </div>
                        <div id="brandDealsDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Live Gifts:</div>
                            <div class="result-value" id="liveGifts">$0.00</div>
                        </div>
                        <div id="liveGiftsDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row highlight">
                            <div class="result-label">Total Monthly:</div>
                            <div class="result-value" id="totalEarnings">$0.00</div>
                        </div>
                        <div id="totalDetail" class="input-hint"></div>
                        <div class="breakdown">
                            <h4>Per Metric</h4>
                            <div class="breakdown-item"><div class="breakdown-label">Per 1K views:</div><div class="breakdown-value" id="per1kViews">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per video:</div><div class="breakdown-value" id="perVideo">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per follower:</div><div class="breakdown-value" id="perFollower">$0.00</div></div>
                        </div>
                        <div class="disclaimer"><p><i class="fas fa-info-circle"></i> Estimates based on 2026 industry averages. Actual earnings vary.</p></div>
                    </div>
                </div>
            </div>""",

"twitch-revenue": """
            <div class="calculator-wrapper">
                <div class="input-panel">
                    <div class="input-group">
                        <label for="avgViewers"><i class="fas fa-eye"></i> Avg Concurrent Viewers</label>
                        <div class="input-with-slider">
                            <input type="number" id="avgViewers" min="10" max="100000" step="10" value="100">
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
                        <div class="input-hint">Tier 1 subs = ~$2.50 to you</div>
                    </div>
                    <div class="input-group">
                        <label for="bitsPerMonth"><i class="fas fa-gem"></i> Bits Per Month</label>
                        <input type="number" id="bitsPerMonth" min="0" max="10000000" step="100" value="5000">
                        <div class="input-hint">100 bits = $1.00 to you</div>
                    </div>
                    <div class="input-group">
                        <label for="streamHours"><i class="fas fa-clock"></i> Stream Hours Per Month</label>
                        <input type="number" id="streamHours" min="1" max="720" value="60">
                    </div>
                    <div class="input-group">
                        <label for="gameCategory"><i class="fas fa-gamepad"></i> Game Category</label>
                        <select id="gameCategory">
                            <option value="justChatting">Just Chatting</option>
                            <option value="fps" selected>FPS / Action</option>
                            <option value="moba">MOBA / Strategy</option>
                            <option value="rpg">RPG / Adventure</option>
                            <option value="sports">Sports Games</option>
                            <option value="casino">Casino / Slots</option>
                        </select>
                    </div>
                    <button id="calculateBtn" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem;">
                        <i class="fas fa-calculator"></i> Calculate Earnings
                    </button>
                </div>
                <div class="results-panel">
                    <div class="results-card">
                        <h3><i class="fas fa-dollar-sign"></i> Estimated Monthly Earnings</h3>
                        <div class="result-row">
                            <div class="result-label">Subscriptions:</div>
                            <div class="result-value" id="subscriptions">$0.00</div>
                        </div>
                        <div id="subscriptionsDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Bits Revenue:</div>
                            <div class="result-value" id="bits">$0.00</div>
                        </div>
                        <div id="bitsDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Ad Revenue:</div>
                            <div class="result-value" id="adRevenue">$0.00</div>
                        </div>
                        <div id="adRevenueDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Sponsorships:</div>
                            <div class="result-value" id="sponsorships">$0.00</div>
                        </div>
                        <div id="sponsorshipsDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row highlight">
                            <div class="result-label">Total Monthly:</div>
                            <div class="result-value" id="totalEarnings">$0.00</div>
                        </div>
                        <div id="totalDetail" class="input-hint"></div>
                        <div class="breakdown">
                            <h4>Per Metric</h4>
                            <div class="breakdown-item"><div class="breakdown-label">Per subscriber:</div><div class="breakdown-value" id="perSubscriber">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per 100 bits:</div><div class="breakdown-value" id="per100Bits">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per stream hour:</div><div class="breakdown-value" id="perHour">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Twitch fee:</div><div class="breakdown-value" id="twitchFee">$0.00</div></div>
                        </div>
                        <div class="disclaimer"><p><i class="fas fa-info-circle"></i> Estimates based on 2026 Twitch payout data. Actual earnings vary.</p></div>
                    </div>
                </div>
            </div>""",

"podcast-revenue": """
            <div class="calculator-wrapper">
                <div class="input-panel">
                    <div class="input-group">
                        <label for="downloadsPerEpisode"><i class="fas fa-download"></i> Downloads Per Episode</label>
                        <div class="input-with-slider">
                            <input type="number" id="downloadsPerEpisode" min="100" max="1000000" step="100" value="5000">
                            <input type="range" id="downloads-slider" min="100" max="1000000" step="100" value="5000">
                        </div>
                        <div class="input-hint">Average downloads in first 30 days</div>
                    </div>
                    <div class="input-group">
                        <label for="episodesPerMonth"><i class="fas fa-microphone"></i> Episodes Per Month</label>
                        <input type="number" id="episodesPerMonth" min="1" max="30" value="4">
                    </div>
                    <div class="input-group">
                        <label for="niche"><i class="fas fa-tags"></i> Podcast Niche</label>
                        <select id="niche">
                            <option value="business">💼 Business & Entrepreneurship</option>
                            <option value="finance">💰 Finance & Investing</option>
                            <option value="tech">💻 Technology</option>
                            <option value="health">⚕️ Health & Wellness</option>
                            <option value="education" selected>🎓 Education</option>
                            <option value="trueCrime">🔍 True Crime</option>
                            <option value="comedy">😂 Comedy</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="preRollAds"><i class="fas fa-ad"></i> Pre-Roll Ads Per Episode</label>
                        <input type="number" id="preRollAds" min="0" max="5" value="1">
                    </div>
                    <div class="input-group">
                        <label for="midRollAds"><i class="fas fa-ad"></i> Mid-Roll Ads Per Episode</label>
                        <input type="number" id="midRollAds" min="0" max="5" value="1">
                    </div>
                    <div class="input-group">
                        <label for="postRollAds"><i class="fas fa-ad"></i> Post-Roll Ads Per Episode</label>
                        <input type="number" id="postRollAds" min="0" max="5" value="0">
                    </div>
                    <button id="calculateBtn" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem;">
                        <i class="fas fa-calculator"></i> Calculate Earnings
                    </button>
                </div>
                <div class="results-panel">
                    <div class="results-card">
                        <h3><i class="fas fa-dollar-sign"></i> Estimated Monthly Earnings</h3>
                        <div class="result-row">
                            <div class="result-label">Pre-Roll Revenue:</div>
                            <div class="result-value" id="preRollRevenue">$0.00</div>
                        </div>
                        <div id="preRollDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Mid-Roll Revenue:</div>
                            <div class="result-value" id="midRollRevenue">$0.00</div>
                        </div>
                        <div id="midRollDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Post-Roll Revenue:</div>
                            <div class="result-value" id="postRollRevenue">$0.00</div>
                        </div>
                        <div id="postRollDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Sponsorships:</div>
                            <div class="result-value" id="sponsorships">$0.00</div>
                        </div>
                        <div id="sponsorshipsDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row highlight">
                            <div class="result-label">Total Monthly:</div>
                            <div class="result-value" id="totalEarnings">$0.00</div>
                        </div>
                        <div id="totalDetail" class="input-hint"></div>
                        <div class="breakdown">
                            <h4>Per Metric</h4>
                            <div class="breakdown-item"><div class="breakdown-label">Per episode:</div><div class="breakdown-value" id="perEpisode">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per 1,000 downloads:</div><div class="breakdown-value" id="per1000Downloads">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per ad slot:</div><div class="breakdown-value" id="perAdSlot">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Monthly downloads:</div><div class="breakdown-value" id="monthlyDownloads">0</div></div>
                        </div>
                        <div class="disclaimer"><p><i class="fas fa-info-circle"></i> Estimates based on 2026 podcast CPM data. Actual earnings vary.</p></div>
                    </div>
                </div>
            </div>""",

"affiliate-calculator": """
            <div class="calculator-wrapper">
                <div class="input-panel">
                    <div class="input-group">
                        <label for="monthlyTraffic"><i class="fas fa-users"></i> Monthly Website Visitors</label>
                        <div class="input-with-slider">
                            <input type="number" id="monthlyTraffic" min="100" max="10000000" step="100" value="10000">
                            <input type="range" id="traffic-slider" min="100" max="10000000" step="100" value="10000">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="conversionRate"><i class="fas fa-chart-line"></i> Conversion Rate</label>
                        <div class="input-with-slider">
                            <input type="number" id="conversionRate" min="0.1" max="20" step="0.1" value="2">
                            <span class="percent">%</span>
                            <input type="range" id="conv-slider" min="0.1" max="20" step="0.1" value="2">
                        </div>
                        <div class="input-hint">% of visitors who make a purchase</div>
                    </div>
                    <div class="input-group">
                        <label for="averageOrderValue"><i class="fas fa-dollar-sign"></i> Average Order Value ($)</label>
                        <input type="number" id="averageOrderValue" min="5" max="10000" step="5" value="75">
                    </div>
                    <div class="input-group">
                        <label for="commissionRate"><i class="fas fa-percent"></i> Commission Rate</label>
                        <div class="input-with-slider">
                            <input type="number" id="commissionRate" min="1" max="80" step="0.5" value="8">
                            <span class="percent">%</span>
                            <input type="range" id="commission-slider" min="1" max="80" step="0.5" value="8">
                        </div>
                        <div class="input-hint">Amazon ~4%, SaaS 20–50%, digital up to 80%</div>
                    </div>
                    <div class="input-group">
                        <label for="affiliatePrograms"><i class="fas fa-network-wired"></i> Number of Affiliate Programs</label>
                        <input type="number" id="affiliatePrograms" min="1" max="20" step="1" value="3">
                    </div>
                    <button id="calculateBtn" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem;">
                        <i class="fas fa-calculator"></i> Calculate Earnings
                    </button>
                </div>
                <div class="results-panel">
                    <div class="results-card">
                        <h3><i class="fas fa-dollar-sign"></i> Estimated Earnings</h3>
                        <div class="result-row">
                            <div class="result-label">Daily:</div>
                            <div class="result-value" id="dailyEarnings">$0.00</div>
                        </div>
                        <div id="dailyDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row">
                            <div class="result-label">Weekly:</div>
                            <div class="result-value" id="weeklyEarnings">$0.00</div>
                        </div>
                        <div id="weeklyDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row highlight">
                            <div class="result-label">Monthly:</div>
                            <div class="result-value" id="monthlyEarnings">$0.00</div>
                        </div>
                        <div id="monthlyDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="result-row annual">
                            <div class="result-label">Yearly:</div>
                            <div class="result-value" id="yearlyEarnings">$0.00</div>
                        </div>
                        <div id="yearlyDetail" class="input-hint" style="margin-bottom:0.5rem;"></div>
                        <div class="breakdown">
                            <h4>Per Metric</h4>
                            <div class="breakdown-item"><div class="breakdown-label">Total commissions:</div><div class="breakdown-value" id="totalCommissions">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Monthly sales:</div><div class="breakdown-value" id="monthlySales">0</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per sale:</div><div class="breakdown-value" id="perSale">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Per visitor:</div><div class="breakdown-value" id="perVisitor">$0.00</div></div>
                            <div class="breakdown-item"><div class="breakdown-label">Commission rate shown:</div><div class="breakdown-value" id="commissionDisplay">0%</div></div>
                        </div>
                        <div id="totalDetail" class="input-hint"></div>
                        <div class="disclaimer"><p><i class="fas fa-info-circle"></i> Estimates based on 2026 affiliate data. Actual earnings vary.</p></div>
                    </div>
                </div>
            </div>""",
}

for tool_dir, new_calc in CALCULATORS.items():
    path = os.path.join(BASE, tool_dir, "index.html")
    with open(path, "r") as f:
        content = f.read()

    # Replace everything between the calculator-wrapper tags
    pattern = r'<div class="calculator-wrapper">.*?</div>\s*</div>\s*</div>\s*(?=\n\s*<div class="adsense-container"|$)'
    replacement = new_calc + '\n\n            '

    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    if new_content == content:
        # Fallback: replace from calculator-wrapper to next </section>
        pattern2 = r'(<div class="calculator-wrapper">)(.*?)(</div>\s*</div>\s*</section>)'
        def replacer(m):
            return new_calc + '\n        </div>\n    </section>'
        new_content = re.sub(pattern2, replacer, content, flags=re.DOTALL)

    with open(path, "w") as f:
        f.write(new_content)

    print(f"Updated: {tool_dir}")

print("\nAll done!")
