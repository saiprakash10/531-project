const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/sparql',
    createProxyMiddleware({
      target: 'http://localhost:3030', // The SPARQL endpoint
      changeOrigin: true,
      pathRewrite: {
        '^/sparql': '/xx/query', // Rewrite the path to the SPARQL endpoint path
      },
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*'; // Add CORS header
      }
    })
  );
};
