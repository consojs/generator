const assert = require('assert');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const utils = require('./utils');
const {exec, spawn} = require('child_process');
const PKG_PATH = path.resolve(__dirname, '..', 'package.json');
const BIN_PATH = path.resolve(path.dirname(PKG_PATH), require(PKG_PATH).bin.conso);
const TEMP_DIR = path.resolve(__dirname, '..', 'temp', String(process.pid + Math.random()));

describe('generator', () => {
    describe('(no args)', () => {
        let ctx = setupTestEnvironment();

        it('should create basic app', (done) => {
            runRaw(ctx.dir, [], function (err, code, stdout, stderr) {
                if (err) return done(err);
                ctx.files = utils.parseCreatedFiles(stdout, ctx.dir);
                ctx.stderr = stderr;
                ctx.stdout = stdout;
                console.log(ctx.files);
                // assert.equal(ctx.files.length, 17);
                done();
            });
        });
    });
});

function runRaw(dir, args, callback) {
    let argv = [BIN_PATH].concat(args);
    let exec = process.argv[0];
    let stderr = '';
    let stdout = '';

    let child = spawn(exec, argv, {
        cwd: dir
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function ondata(str) {
        stdout += str;
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function ondata(str) {
        stderr += str;
    });

    child.on('close', onclose);
    child.on('error', callback);

    function onclose(code) {
        callback(null, code, stdout, stderr);
    }
}

function setupTestEnvironment(name) {
    let ctx = {};
    before('create environment', function (done) {
        ctx.dir = name ? path.resolve(TEMP_DIR, name.replace(/[<>]/g, '')) : path.resolve(TEMP_DIR);
        mkdirp(ctx.dir, done);
    });

    after('cleanup environment', function (done) {
        this.timeout(30000);
        cleanup(ctx.dir, done);
    });

    return ctx;
}
function cleanup(dir, callback) {
    if (typeof dir === 'function') {
        callback = dir;
        dir = TEMP_DIR
    }

    rimraf(dir, function (err) {
        callback(err)
    })
}