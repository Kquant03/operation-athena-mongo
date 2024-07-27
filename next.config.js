const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        '@mongodb-js/zstd': false,
        'snappy': false,
      };
    }
    
    config.resolve.alias['@mongodb-js/zstd'] = path.join(__dirname, 'stub.js');
    config.resolve.alias['snappy'] = path.join(__dirname, 'stub.js');
    
    return config;
  },
};