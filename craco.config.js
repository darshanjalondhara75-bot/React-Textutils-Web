module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const rules = webpackConfig.module?.rules || [];
      rules.forEach((rule) => {
        if (rule && typeof rule === 'object' && Array.isArray(rule.oneOf)) {
          rule.oneOf.forEach((r) => {
            if (
              r &&
              r.enforce === 'pre' &&
              Array.isArray(r.use) &&
              r.use.some((u) => typeof u.loader === 'string' && u.loader.includes('source-map-loader'))
            ) {
              // Restrict to our src and exclude node_modules to avoid broken third-party sourcemaps
              r.include = /src/;
              r.exclude = /node_modules/;
            }
          });
        }
      });
      return webpackConfig;
    },
  },
};