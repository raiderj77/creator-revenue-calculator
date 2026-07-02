/* "Look up your channel" — pulls real public stats via the YouTube Data API and
   personalizes the calculator. The API key below is HTTP-referrer-restricted to
   creatorrevenuecalculator.com + limited to the YouTube Data API, so it is safe
   to ship in client code (it will not work from any other domain). */
(function () {
  "use strict";
  var KEY = "AIzaSyDM3LGGcYSvYYO5Xj2s_JapGWZypUBSU_U";
  var API = "https://www.googleapis.com/youtube/v3/channels";

  function parseChannel(input) {
    input = (input || "").trim();
    var m = input.match(/(UC[\w-]{22})/); // channel ID (in URL or bare)
    if (m) return "id=" + m[1];
    m = input.match(/@([A-Za-z0-9._-]+)/); // @handle (bare or in URL)
    if (m) return "forHandle=" + encodeURIComponent(m[1]);
    if (/^[A-Za-z0-9._-]+$/.test(input)) return "forHandle=" + encodeURIComponent(input);
    return null;
  }

  function fmt(n) {
    n = +n || 0;
    if (n >= 1e9) return (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + "K";
    return "" + n;
  }

  function setViews(value) {
    var v = Math.min(10000000, Math.max(1000, Math.round(value)));
    var num = document.getElementById("views");
    var slider = document.getElementById("views-slider");
    if (num) {
      num.value = v;
      num.dispatchEvent(new Event("input", { bubbles: true }));
      num.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (slider) {
      slider.value = v;
      slider.dispatchEvent(new Event("input", { bubbles: true }));
    }
    return v;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var section = document.querySelector(".input-section");
    if (!section) return;

    var box = document.createElement("div");
    box.className = "input-group";
    box.innerHTML =
      '<label><i class="fab fa-youtube"></i> Look up your channel (optional)</label>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<input type="text" id="yt-ch" placeholder="@yourhandle or channel URL" ' +
      'style="flex:1;min-width:180px" autocomplete="off">' +
      '<button type="button" id="yt-btn" class="btn btn-secondary">Look up</button></div>' +
      '<div class="input-hint" id="yt-msg">Pull your real subscriber count &amp; views to personalize the estimate.</div>';
    section.insertBefore(box, section.firstChild);

    var btn = document.getElementById("yt-btn");
    var inp = document.getElementById("yt-ch");
    var msg = document.getElementById("yt-msg");

    function lookup() {
      var q = parseChannel(inp.value);
      if (!q) {
        msg.textContent = "Enter your @handle or channel URL.";
        return;
      }
      msg.textContent = "Looking up…";
      fetch(API + "?part=snippet,statistics&" + q + "&key=" + KEY)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var it = d && d.items && d.items[0];
          if (!it) {
            msg.textContent = "Couldn't find that channel — try your @handle.";
            return;
          }
          var s = it.statistics || {}, sn = it.snippet || {};
          var subs = +s.subscriberCount || 0;
          var views = +s.viewCount || 0;
          var vids = +s.videoCount || 0;
          var months = Math.max(1, (Date.now() - new Date(sn.publishedAt).getTime()) / (1000 * 60 * 60 * 24 * 30.44));
          var monthly = setViews(views / months);
          msg.innerHTML =
            "<strong>" + (sn.title || "Your channel") + "</strong> — " +
            fmt(subs) + " subscribers · " + fmt(views) + " total views · " +
            fmt(vids) + " videos.<br>Set Monthly Views to your lifetime average (~" +
            fmt(monthly) + ") — adjust to your recent traffic for a sharper estimate.";
          if (typeof window.gtag === "function") {
            window.gtag("event", "channel_lookup", { channel: sn.title || "" });
          }
        })
        .catch(function () {
          msg.textContent = "Lookup failed — please try again.";
        });
    }

    btn.addEventListener("click", lookup);
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); lookup(); }
    });
  });
})();
