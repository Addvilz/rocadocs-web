'use strict';

require('./check-versions')();
const config = require('../config');
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = config.dev.env;
}
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const opn = require('opn');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');
const fs = require('fs');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
});

const hotMiddleware = require('webpack-hot-middleware')(compiler);
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({action: 'reload'});
        cb();
    });
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context];
    if (typeof options === 'string') {
        options = {target: options};
    }
    app.use(proxyMiddleware(context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

app.get('/data.json', function (req, res) {
    fs.readFile(__dirname + '/../data.json', 'utf8', function (err, data) {
        if (err) {
            res.send('{}');
        }
        res.send(data);
    });
});

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    const uri = 'http://localhost:' + port;
    console.log('Listening at ' + uri + '\n');
    opn(uri);
});
