/* New Year decoration for every page: a twinkling garland at the top and light snowfall.
   Snow can be switched off with the ❄ button (remembered in this browser); it is off for "reduce motion". */
(function () {
  var KEY = "ews-snow";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var css = document.createElement("style");
  css.textContent =
    ".ny-garland{display:block;width:100%;height:40px;pointer-events:none;overflow:visible}" +
    ".ny-garland .b{animation:ny-tw 2.4s ease-in-out infinite alternate}" +
    ".ny-garland .b:nth-of-type(3n){animation-delay:.8s}.ny-garland .b:nth-of-type(3n+1){animation-delay:1.6s}" +
    "@keyframes ny-tw{from{opacity:1}to{opacity:.35}}" +
    "@media (prefers-reduced-motion:reduce){.ny-garland .b{animation:none}}" +
    ".ny-snow{position:fixed;inset:0;pointer-events:none;z-index:50}" +
    ".ny-btn{position:fixed;right:14px;bottom:14px;z-index:51;width:44px;height:44px;border-radius:50%;border:2px solid var(--line,#ddd);" +
    "background:var(--surface,#fff);color:var(--fg,#222);font-size:20px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.12)}" +
    ".ny-btn[aria-pressed=false]{opacity:.55}";
  document.head.appendChild(css);

  // Garland: a wire with bulbs, drawn wide and stretched to the page width.
  var colors = ["#E2457E", "#F2C232", "#16936A", "#3A57E8", "#FF7A3D"];
  var svg = '<svg class="ny-garland" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M0 6 Q 60 26 120 6 T 240 6 T 360 6 T 480 6 T 600 6 T 720 6 T 840 6 T 960 6 T 1080 6 T 1200 6" fill="none" stroke="#2E5E4E" stroke-width="2"/>';
  for (var i = 0; i < 20; i++) {
    var x = 30 + i * 60, y = 16 + (i % 2 ? -4 : 4);
    svg += '<ellipse class="b" cx="' + x + '" cy="' + (y + 6) + '" rx="6" ry="9" fill="' + colors[i % colors.length] + '"/>' +
           '<rect x="' + (x - 3) + '" y="' + (y - 5) + '" width="6" height="4" rx="1" fill="#5B6B63"/>';
  }
  svg += "</svg>";
  var holder = document.createElement("div");
  holder.innerHTML = svg;
  document.body.insertBefore(holder.firstChild, document.body.firstChild);

  // Snow
  var canvas = null, raf = 0, flakes = [];
  function start() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.className = "ny-snow";
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var color = dark ? "rgba(255,255,255,.75)" : "rgba(140,160,205,.55)";
    function size() { canvas.width = innerWidth; canvas.height = innerHeight; }
    size(); addEventListener("resize", size);
    flakes = [];
    for (var i = 0; i < 45; i++) flakes.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 1.5 + Math.random() * 2.5, s: .3 + Math.random() * .7, d: Math.random() * 6 });
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.s; f.d += .01; f.x += Math.sin(f.d) * .4;
        if (f.y > canvas.height + 5) { f.y = -5; f.x = Math.random() * canvas.width; }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    })();
  }
  function stop() { cancelAnimationFrame(raf); if (canvas) { canvas.remove(); canvas = null; } }

  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "ny-btn"; btn.textContent = "❄";
  btn.title = "Снег: включить или выключить";
  var on = !reduce && get() !== "off";
  btn.setAttribute("aria-pressed", String(on));
  btn.setAttribute("aria-label", "Снег");
  btn.onclick = function () {
    on = !on; btn.setAttribute("aria-pressed", String(on)); set(on ? "on" : "off");
    on ? start() : stop();
  };
  document.body.appendChild(btn);
  if (on) start();
})();
