const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/sparql',
    createProxyMiddleware({
      target: 'http://localhost:3030', // The SPARQL endpoint
      changeOrigin: true,
      pathRewrite: {
        '^/sparql': '/final/query', 
      },
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*'; 
      }
    })
  );
};
