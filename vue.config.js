require('dotenv').config();

let PORT = 4000;
if (process.env.NODE_ENV === 'production') PORT = process.env.PORT || 8080;

module.exports = {
  outputDir: 'build',
  devServer: {
    disableHostCheck: true,
    port: PORT+1,
    progress: false,
    proxy: {
      "/api": {
        target: `http://localhost:${PORT}/`,
        logLevel: "debug"
      }
    }
  }
};