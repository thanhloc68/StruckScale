/* eslint-disable no-undef */
const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/weatherforecast",
    "../api/home"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://100.100.100.132:7007',
        secure: false
    });

    app.use(appProxy);
};
