![](https://raw.githubusercontent.com/wiki/tageecc/conso/conso.png)

Fast, Configurable, Intelligent web framework for [node](http://nodejs.org).

[![NPM version][npm-image]][npm-url]
[![NPM quality][quality-image]][quality-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/conso-generator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/conso-generator
[quality-image]: http://npm.packagequality.com/shield/conso-generator.svg
[quality-url]: http://packagequality.com/#?package=conso-generator
[travis-image]: https://img.shields.io/travis/tageecc/conso-generator.svg?style=flat-square
[travis-url]: https://travis-ci.org/tageecc/conso-generator
[codecov-image]: https://img.shields.io/codecov/c/github/tageecc/conso-generator.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/tageecc/conso-generator
[david-image]: https://img.shields.io/david/tageecc/conso-generator.svg?style=flat-square
[david-url]: https://david-dm.org/tageecc/conso-generator
[download-image]: https://img.shields.io/npm/dm/conso-generator.svg?style=flat-square
[download-url]: https://npmjs.org/package/conso-generator

## Installation

```bash
$ npm install -g conso-generator
```
## Commands

```bash
conso init [projectName]  Create a new conso project
```

## Quick Start

 - Create the app:
 
```bash
$ conso init showcase && cd showcase
```

 - Install dependencies:
  
```bash
$ npm install
```
  
 - Start the server:
  
```bash
$ npm start
```

 Then Open `http://localhost:3000`

## Command Line Options
This generator can also be further configured with the following command line flags.

    -V, --version               output the version number
    -v, --view <view>           set view dir
    -e, --engine <engine>       set view engine
    -p, --public <engine>       set public dir
    -r, --routes <routes>       set routes dir
    -c, --config <filename>     set config filename
    -f, --force                 force to override directory
        --git                   add .gitignore
    -h, --help                  output usage information



## License

[MIT](LICENSE)