// Replaced during the static build from NEXT_PUBLIC_BEEHIIV_EMBED_URL.
const BEEHIIV_EMBED_URL = "__NEXT_PUBLIC_BEEHIIV_EMBED_URL__";

(() => {
    const blocks = document.querySelectorAll('[data-email-capture]');
    if (!BEEHIIV_EMBED_URL.trim()) {
        blocks.forEach((block) => block.remove());
        return;
    }

    let embedUrl;
    try {
        embedUrl = new URL(BEEHIIV_EMBED_URL);
        if (embedUrl.protocol !== 'https:') throw new Error('HTTPS required');
    } catch {
        blocks.forEach((block) => block.remove());
        return;
    }

    blocks.forEach((block) => {
        const region = block.querySelector('[data-email-capture-embed]');
        if (!region) {
            block.remove();
            return;
        }
        const iframe = document.createElement('iframe');
        iframe.title = 'Newsletter signup with Beehiiv';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer';
        iframe.src = embedUrl.href;
        region.replaceChildren(iframe);
        block.hidden = false;
    });
})();
