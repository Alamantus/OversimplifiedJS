const fs = require('fs');
const { minify } = require('terser');

async function minifyOversimplifiedJS() {
  const compressed = await minify(fs.readFileSync("Oversimplified.js", "utf8"), { "compress": true });

  let result = compressed.code;

  const replacements = {
    "Oversimplified.Settings.": "OS.S.",
    "Oversimplified.Controls.": "OS.C.",
    "Oversimplified.Rooms.": "OS.R.",
    "Oversimplified.PremadeObjects.": "OS.P.",
    "Oversimplified.Animations.": "OS.A.",
    "Oversimplified.Effects.Sounds.": "OS.E.S.",
    "Oversimplified.Effects.Tunes.": "OS.E.T.",
    "Oversimplified.Effects.": "OS.E.",
    "Oversimplified.": "OS."
  };

  Object.keys(replacements).forEach(toReplace => {
    const toReplaceRegExp = new RegExp(toReplace.replace(/\./g, '\\.'), 'g');
    result = result.replace(toReplaceRegExp, replacements[toReplace]);
  });

  fs.writeFileSync('./Oversimplified.min.js', result);
}

minifyOversimplifiedJS();