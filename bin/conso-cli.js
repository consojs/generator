#!/usr/bin/env node

// Conso' application generator
const {resolve, basename} = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const program = require('commander');

class Generator {
    constructor() {
        this.program = program;
        this.templateDir = resolve(__dirname, '..', 'templates');
        this.program
            .version(require('../package.json').version)
            .name('conso')
            .usage('init [option]')
            .option('-v, --view <viewDir>', 'set view dir', './view')
            .option('-e, --engine <engine>', 'set view engine', 'hbs')
            .option('-p, --public <publicDir>', 'set public dir', './public')
            .option('-r, --routes <routesDir>', 'set routes dir', './routes')
            .option('-c, --config <filename>', 'set config filename', 'webConfig.json')
            .option('-f, --force', 'force to override directory')
            .option('    --git', 'add .gitignore');


        this.program
            .command('init [projectName]')
            .description('Create a new conso project')
            .action(this.createApplication.bind(this));

        this.program.parse(process.argv);

        if (!this.program.args.length) {
            this.program.help();
        }
    }

    prompt(msg) {
        return new Promise((resolve, reject) => {
            process.stdout.write(msg);
            process.stdin.setEncoding('utf8');
            process.stdin.once('data', val => {
                resolve(val.trim());
            }).resume();
        });
    }

    launchedFromCmd() {
        return process.platform === 'win32' &&
            process.env._ === undefined;
    }

    async createApplication(projectName) {
        this.projectName = projectName || basename(process.cwd());
        this.project_path = projectName ? resolve(projectName) : process.cwd();

        fse.ensureDirSync(this.project_path);
        if (fse.readdirSync(this.project_path).length) {
            let p = await this.prompt('\n  destination is not empty, continue? [y/N]?');
            if (!/^y|yes|ok|true$/i.test(p)) {
                console.log(chalk.red('The wizard has been aborted'));
                return process.exit();
            }
        }

        this.createTemplate();
    }

    createTemplate() {
        let params = this.program;

        console.log(chalk.green(`\n   √ create : ${this.project_path}`));

        // view
        fse.copySync(resolve(this.templateDir, './view', './' + params.engine), resolve(this.project_path, './view'), {
            filter: (src, dest) => {
                console.log(chalk.green(`   √ create : ${dest}`));
                return true;
            }
        });

        // routes
        fse.copySync(resolve(this.templateDir, './routes'), resolve(this.project_path, './routes'), {
            filter: (src, dest) => {
                console.log(chalk.green(`   √ create : ${dest}`));
                return true;
            }
        });

        // public
        fse.copySync(resolve(this.templateDir, './public'), resolve(this.project_path, './public'), {
            filter: (src, dest) => {
                console.log(chalk.green(`   √ create : ${dest}`));
                return true;

            }
        });

        //.gitignore
        if (params.git) {
            fse.copySync(resolve(this.templateDir, 'gitignore'), resolve(this.project_path, '.gitignore'), {
                filter: (src, dest) => {
                    console.log(chalk.green(`   √ create : ${dest}`));
                    return true;
                }
            });
        }

        //app.js
        let app_str = `let {Application} = require('conso');\nnew Application(${params.config ? '{config: "' + params.config + '"}' : ''}).run();`;
        if ('webConfig.json' === params.config) {
            app_str = `let {Application} = require('conso');\nnew Application().run();`;
        }
        fse.outputFileSync(resolve(this.project_path, 'app.js'), app_str);
        console.log(chalk.green(`   √ create : ${resolve(this.project_path, 'app.js')}`));

        // package.json
        let pkg = {
            name: this.projectName,
            version: '0.0.0',
            private: true,
            scripts: {
                start: 'node app.js'
            },
            dependencies: {
                "conso": '^1.0.0',
            }
        };
        switch (params.engine) {
            case 'dust':
                pkg.dependencies['adaro'] = '^1.0.4';
                break;
            case 'jade':
                pkg.dependencies['jade'] = '^1.11.0';
                break;
            case 'ejs':
                pkg.dependencies['ejs'] = '^2.5.6';
                break;
            case 'hjs':
                pkg.dependencies['hjs'] = '^0.0.6';
                break;
            case 'hbs':
                pkg.dependencies['hbs'] = '^4.0.1';
                break;
            case 'pug':
                pkg.dependencies['pug'] = '^2.0.0-rc.2';
                break;
            case 'twig':
                pkg.dependencies['twig'] = '^1.10.5';
                break;
            case 'vash':
                pkg.dependencies['vash'] = '^0.12.2';
                break;
        }
        fse.outputFileSync(resolve(this.project_path, 'package.json'), JSON.stringify(pkg, null, 2));
        console.log(chalk.green(`   √ create : ${resolve(this.project_path, 'package.json')}`));

        // webConfig2.json
        let webConfig = {
            project: this.projectName,
            host: "localhost",
            port: 3000,
            public: params.public,
            encoding: "utf8",
            view: {
                engine: params.engine,
                ext: params.engine,
                dir: params.view,
                layout: "layout",
                cache: false,
                option: {}
            },
            annotations: {
                enable: true,
                basePackage: params.routes
            }
        };
        fse.outputFileSync(resolve(this.project_path, params.config), JSON.stringify(webConfig, null, 2));
        console.log(chalk.green(`   √ create : ${resolve(this.project_path, params.config)}`));

        const dot = this.launchedFromCmd() ? '>' : '$';
        console.log();
        console.log('   install dependencies:');
        console.log('     %s cd %s && npm install', dot, this.projectName);
        console.log();
        console.log('   run the app:');

        if (this.launchedFromCmd()) {
            console.log('     > SET DEBUG=%s:* & npm start', this.projectName);
        } else {
            console.log('     $ DEBUG=%s:* npm start', this.projectName);
        }

        process.exit();
    }
}


module.exports = new Generator();
