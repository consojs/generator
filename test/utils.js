let path = require('path');

module.exports.childEnvironment = childEnvironment;
module.exports.parseCreatedFiles = parseCreatedFiles;
module.exports.stripColors = stripColors;
module.exports.stripWarnings = stripWarnings;

function childEnvironment () {
    let env = Object.create(null);

    // copy the environment except for npm veriables
    for (let key in process.env) {
        if (key.substr(0, 4) !== 'npm_') {
            env[key] = process.env[key];
        }
    }

    return env;
}

function parseCreatedFiles (output, dir) {
    let files = [];
    let lines = output.split(/[\r\n]+/);
    let match;

    for (let i = 0; i < lines.length; i++) {
        if ((match = /create.*?: (.*)$/.exec(lines[i]))) {
            let file = match[1];

            if (dir) {
                file = path.resolve(dir, file);
                file = path.relative(dir, file);
            }

            file = file.replace(/\\/g, '/');
            files.push(file);
        }
    }

    return files;
}

function stripColors (str) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1b\[(\d+)m/g, '_color_$1_');
}

function stripWarnings (str) {
    return str.replace(/\n(?:\x20{2}warning: [^\n]+\n)+\n/g, '');
}
