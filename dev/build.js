const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const outputFolder = './dist/';

if (!fs.existsSync(path.resolve(outputFolder))) {
  fs.mkdirSync(path.resolve(outputFolder));
}

async function minifyOversimplifiedJS() {
  const source = fs.readFileSync(path.resolve('Oversimplified.js'), 'utf8');
  const compressed = await minify(source, { 'compress': true });

  let result = compressed.code;

  const replacements = {
    'Oversimplified.Settings.': 'OS.S.',
    'Oversimplified.Controls.': 'OS.C.',
    'Oversimplified.Rooms.': 'OS.R.',
    'Oversimplified.PremadeObjects.': 'OS.P.',
    'Oversimplified.Animations.': 'OS.A.',
    'Oversimplified.Effects.Sounds.': 'OS.E.S.',
    'Oversimplified.Effects.Tunes.': 'OS.E.T.',
    'Oversimplified.Effects.': 'OS.E.',
    'Oversimplified.': 'OS.'
  };

  Object.keys(replacements).forEach(toReplace => {
    const toReplaceRegExp = new RegExp(toReplace.replace(/\./g, '\\.'), 'g');
    result = result.replace(toReplaceRegExp, replacements[toReplace]);
  });

  fs.writeFileSync(path.resolve(outputFolder, 'Oversimplified.js'), result);
  fs.writeFileSync(path.resolve(outputFolder, 'Oversimplified.dev.js'), source);
}

minifyOversimplifiedJS();

fs.copyFileSync(path.resolve('./index.html'), path.resolve(outputFolder, 'index.html'));
fs.copyFileSync(path.resolve('./start.js'), path.resolve(outputFolder, 'start.js'));
