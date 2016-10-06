module.exports = {
  paths: {
    public: './'
  },

  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },

  npm: {
    globals: {
      d3: 'd3',
      topojson: 'topojson'
    }
  },

  plugins: {
    babel: {presets: ['es2015', 'react']}
  }
};
