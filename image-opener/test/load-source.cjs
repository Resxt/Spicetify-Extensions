const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Run the actual TypeScript source with isolated Spotify/browser dependencies.
module.exports = function loadSource(entry, globals = {}) {
  const cache = new Map();
  const context = vm.createContext({console, URL, Error, setTimeout, clearTimeout, ...globals});
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = {exports: {}};
    cache.set(file, module);
    const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React, esModuleInterop: true}
    }).outputText;
    const wrapper = vm.runInContext("(function(require,module,exports){" + source + "\n})", context, {filename: file});
    wrapper(name => {
      if (!name.startsWith(".")) throw new Error("Unexpected dependency: " + name);
      const resolved = path.resolve(path.dirname(file), name);
      return load([resolved, resolved + ".ts", resolved + ".tsx"].find(candidate => fs.existsSync(candidate)));
    }, module, module.exports);
    return module.exports;
  }
  return load(path.resolve(__dirname, "../src", entry));
};
