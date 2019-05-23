const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin')
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const path = require('path');
const { name, version } = require(path.join(__dirname, 'package.json'));

process.env.VUE_APP_VERSION = version;

module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        config
            .entryPoints
            .delete('app')
            .end()
            .entry('contentScript')
            .add('./src/contentScript.ts')
            .end()
            .entry('background')
            .add('./src/background.ts')
            .end()
            .entry('inject')
            .add('./src/inject.ts')
            .end();

        config.optimization.splitChunks(false);
    },
    pages: {
        'popup/popup': {
            entry: 'src/popup/main.ts',
            template: 'src/popup/index.html',
        },
        'sdk/sdk': {
            entry: 'src/sdk/main.ts',
            template: 'src/sdk/index.html',
        },
    },
    configureWebpack: config => {
        config.output.filename = '[name].js';

        config.plugins.push(new CopyWebpackPlugin([
            {from: 'src/icons', to: 'icons'},
            {
                from: 'src/manifest.json',
                to: 'manifest.json',
                transform: content => {
                    const jsonContent = JSON.parse(content);

                    if (process.env.NODE_ENV === 'development') {
                        jsonContent.content_security_policy = 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'';
                    }

                    jsonContent.version = version;

                    return JSON.stringify(jsonContent, null, 2);
                },
            },
        ]));

        if (process.env.NODE_ENV === 'development') {
            config.plugins.push(new ChromeExtensionReloader());
        } else {
            config.plugins.push(new ZipWebpackPlugin({
                path: path.resolve(__dirname, 'build-zip'),
                filename: `${name}-v${version}.zip`
            }))
        }
    }
};
