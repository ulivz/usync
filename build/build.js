#!/usr/bin/env node

var path = require('path')
var rollup = require("rollup")
var babel = require("rollup-plugin-babel")
var eslint = require('rollup-plugin-eslint')
var resolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')
var replace = require('rollup-plugin-replace')
var uglify = require('rollup-plugin-uglify')
var watch = require('rollup-watch')
var ENTRY_FILE = 'src/Usync.js';
var OUTPUT_FILE = 'dist/Usync.js';
var OUTPUT_MIN_FILE = 'dist/Usync.min.js';

var argv = require('yargs')
    .option('p', {
        alias: 'production',
        default: true,
        boolean: true,
        describe: 'Production enviroment',
        type: 'boolean'
    })
    .option('w', {
        alias: 'watch',
        default: true,
        boolean: true,
        describe: 'Production enviroment',
        type: 'boolean'
    })
    .argv;

var isProd = argv.p,
    isWatch = argv.w;

function build(opts) {
    rollup
        .rollup({
            entry: opts.entry,
            plugins: (opts.plugins || []).concat([
                resolve({
                    // Help node module migrate to ES2015
                    jsnext: true,
                    // main and browser help plugin to decide which file should be used by bunble
                    main: true,
                    browser: true,
                }),
                commonjs(),
                babel({
                    exclude: 'node_modules/**'
                }),
                eslint({
                    exclude: ''
                }),
                replace({
                    exclude: 'node_modules/**',
                    ENV: JSON.stringify(process.env.NODE_ENV || 'development').replace(/\s/g, ''),
                }),
            ])
        })
        .then(function (bundle) {
            var dest = (opts.output || opts.entry)
            console.log('[Dest] ' + dest)
            bundle.write({
                format: "umd",
                moduleName: opts.moduleName || 'D',
                dest: dest,
                // sourceMap: 'inline'
            });
        })
        .catch(function (err) {
            console.log(err)
        })
}

build({
    entry: ENTRY_FILE,
    output: OUTPUT_FILE
})

if (isProd) {
    console.log('Production Enviroment')
    build({
        entry: ENTRY_FILE,
        output: OUTPUT_MIN_FILE,
        plugins: [uglify()]
    })
}



