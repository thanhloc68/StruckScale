/* eslint-disable no-undef */
const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "../api/home"
];
module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://100.100.100.115:7007',
        secure: false,
        changeOrigin: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
    });
    app.use(appProxy);
};