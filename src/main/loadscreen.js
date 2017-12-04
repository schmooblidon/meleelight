let scriptsLoaded = 0;
const scripts = [{
  path: "./js/main.js",
  text: "core code",
  size: 7.7436 * 1024 * 1024,
  loaded: 0,
}];

const totalSize = scripts.reduce((prev, script) => prev + script.size, 0);

let screenEl;
let textEl;
let percentEl;

function loadNextScript() {
  const script = scripts[scriptsLoaded];
  updateLoadingText(`Loading ${script.text}`);

  const req = new XMLHttpRequest();

  // Report progress
  req.addEventListener("progress", (ev) => {
    script.loaded = ev.loaded;
    updateLoadingPct(script.loaded / totalSize);
  });

  // Drop in to a script tag
  req.addEventListener("load", (ev) => {
    scriptsLoaded++;
    script.loaded = script.size;

    const finished = scriptsLoaded >= scripts.length;
    const scriptTag = document.createElement("script");
    scriptTag.innerHTML = ev.target.responseText;

    if (finished) {
      updateLoadingText("Initializing");
      setTimeout(() => {
        document.body.appendChild(scriptTag);
        screenEl.className = "fadeout";
        window.start();
        setTimeout(() => {
          screenEl.remove();
        }, 300);
      }, 50);
    }
    else {
      document.body.appendChild(scriptTag);
      loadNextScript();
    }
  });

  req.open("GET", script.path);
  req.send();
};

function updateLoadingText(text) {
  textEl.innerHTML = `${text}...`;
}

function updateLoadingPct(pct) {
  percentEl.innerHTML = parseInt(pct * 100, 10);
}

document.addEventListener("DOMContentLoaded", () => {
  screenEl = document.getElementById("loadScreen");
  textEl = document.getElementById("loadTextEdit");
  percentEl = document.getElementById("loadPercentEdit");
  loadNextScript();
});
