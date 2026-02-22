#!/bin/bash

# Update TikTok placeholder
sed -i 's/Twitch Revenue Calculator/TikTok Creator Fund Calculator/g' tools/tiktok-revenue/index.html
sed -i 's/Twitch/TikTok/g' tools/tiktok-revenue/index.html
sed -i 's/twitch/tiktok/g' tools/tiktok-revenue/index.html
sed -i 's/fab fa-twitch/fab fa-tiktok/g' tools/tiktok-revenue/index.html
sed -i 's/#9146ff/#000000/g' tools/tiktok-revenue/index.html
sed -i 's/linear-gradient(135deg, #9146ff 0%, #6441a5 100%)/linear-gradient(135deg, #000000 0%, #69C9D0 100%)/g' tools/tiktok-revenue/index.html
sed -i 's/Estimate Twitch earnings from subscriptions, bits, ads, and sponsorships/Calculate TikTok Creator Fund earnings based on views, engagement, and region/g' tools/tiktok-revenue/index.html
sed -i 's/We.*building.*:/We\'"'"'re building a comprehensive TikTok revenue calculator to help creators estimate their earnings from:/g' tools/tiktok-revenue/index.html

# Update Instagram placeholder
sed -i 's/Twitch Revenue Calculator/Instagram Monetization Calculator/g' tools/instagram-revenue/index.html
sed -i 's/Twitch/Instagram/g' tools/instagram-revenue/index.html
sed -i 's/twitch/instagram/g' tools/instagram-revenue/index.html
sed -i 's/fab fa-twitch/fab fa-instagram/g' tools/instagram-revenue/index.html
sed -i 's/#9146ff/#E4405F/g' tools/instagram-revenue/index.html
sed -i 's/linear-gradient(135deg, #9146ff 0%, #6441a5 100%)/linear-gradient(135deg, #E4405F 0%, #405DE6 100%)/g' tools/instagram-revenue/index.html
sed -i 's/Estimate Twitch earnings from subscriptions, bits, ads, and sponsorships/Estimate Instagram earnings from Reels bonuses, brand partnerships, and sponsored posts/g' tools/instagram-revenue/index.html
sed -i 's/We.*building.*:/We\'"'"'re building a comprehensive Instagram monetization calculator to help creators estimate their earnings from:/g' tools/instagram-revenue/index.html

# Update Podcast placeholder
sed -i 's/Twitch Revenue Calculator/Podcast Revenue Calculator/g' tools/podcast-revenue/index.html
sed -i 's/Twitch/Podcast/g' tools/podcast-revenue/index.html
sed -i 's/twitch/podcast/g' tools/podcast-revenue/index.html
sed -i 's/fab fa-twitch/fas fa-podcast/g' tools/podcast-revenue/index.html
sed -i 's/#9146ff/#8A2BE2/g' tools/podcast-revenue/index.html
sed -i 's/linear-gradient(135deg, #9146ff 0%, #6441a5 100%)/linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)/g' tools/podcast-revenue/index.html
sed -i 's/Estimate Twitch earnings from subscriptions, bits, ads, and sponsorships/Calculate podcast earnings from sponsorships, ads, subscriptions, and listener support/g' tools/podcast-revenue/index.html
sed -i 's/We.*building.*:/We\'"'"'re building a comprehensive podcast revenue calculator to help podcasters estimate their earnings from:/g' tools/podcast-revenue/index.html

# Update Affiliate placeholder
sed -i 's/Twitch Revenue Calculator/Affiliate Marketing Calculator/g' tools/affiliate-calculator/index.html
sed -i 's/Twitch/Affiliate/g' tools/affiliate-calculator/index.html
sed -i 's/twitch/affiliate/g' tools/affiliate-calculator/index.html
sed -i 's/fab fa-twitch/fas fa-link/g' tools/affiliate-calculator/index.html
sed -i 's/#9146ff/#10b981/g' tools/affiliate-calculator/index.html
sed -i 's/linear-gradient(135deg, #9146ff 0%, #6441a5 100%)/linear-gradient(135deg, #10b981 0%, #059669 100%)/g' tools/affiliate-calculator/index.html
sed -i 's/Estimate Twitch earnings from subscriptions, bits, ads, and sponsorships/Estimate affiliate marketing earnings based on traffic, conversion rates, and commission rates/g' tools/affiliate-calculator/index.html
sed -i 's/We.*building.*:/We\'"'"'re building a comprehensive affiliate marketing calculator to help creators estimate their earnings from:/g' tools/affiliate-calculator/index.html

echo "Placeholder pages updated successfully!"