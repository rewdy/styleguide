/* eslint-env node */
const path = require('path');

const fractal = module.exports = require('@frctl/fractal').create();
const pkg = require(path.join(__dirname, 'package.json'));

/*-------------------------------------------------------*\
  Feel free to adapt Fractal config below to your needs
\*-------------------------------------------------------*/

/**
 * Metadata
 */
fractal.set('project.title', 'Liip Styleguide');
// Provide the package.json "version" to the templates
fractal.set('project.version', pkg.version);

/**
 * Files location
 */
fractal.components.set('path', path.join(__dirname, 'components'));
fractal.docs.set('path', path.join(__dirname, 'docs'));
fractal.web.set('static.path', path.join(__dirname, 'public'));

/**
 * Build options
 */
// If you change the build destination, you should adapt webpack.common.js "output.path" too.
fractal.web.set('builder.dest', 'dist');

/**
 * Templating
 */
// Use Nunjucks as the template engine
fractal.components.engine('@frctl/nunjucks');
fractal.docs.engine('@frctl/nunjucks');
// Look for templates with a ".nunj" extension
fractal.components.set('ext', '.nunj');

/**
 * Fixture data used to illustrate components
 */
const expertises = require('./data/expertises.json');
const liipers = require('./data/liipers.json');
const offices = require('./data/offices.json');

fractal.components.set('default.context', {
  expertises,
  liipers,
  offices,
});

/**
 * Customs statuses
 */
fractal.components.set('statuses', {
  prototype: {
    label: 'Prototype',
    description: 'Do not implement in production.',
    color: '#D34361',
  },
  wip: {
    label: 'WIP',
    description: 'Work in progress. Implement with caution.',
    color: '#EFA00F',
  },
  ready: {
    label: 'Ready',
    description: 'Ready to implement.',
    color: '#A4C339',
  },
});

/**
 * Custom theme
 */
const theme = require('./theme');
fractal.web.theme(theme);


/*----------------------------------------*\
  Change the following at your own risk
\*----------------------------------------*/

/**
 * Server configuration
 */
fractal.web.set('server.port', 4000);
fractal.web.set('server.sync', true);
fractal.web.set('debug', true);

/**
 * Prevent Bluebird warnings like "a promise was created in a handler but was not returned from it"
 * caused by Nunjucks from polluting the console
 */
const bluebird = require('bluebird');
bluebird.config({
  warnings: false,
});