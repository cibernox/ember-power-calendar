/* eslint-env node */

/*
This turns SCSS into CSS that can be used in projects that don't use a
precompiler.
*/

var sass = require('sass'); // eslint-disable-line
var fs = require('fs');
var path = require('path');

var inputFile = path.join(__dirname, 'app', 'styles', 'ember-power-calendar.scss');
var outputFile = path.join(__dirname, 'vendor', 'ember-power-calendar.css');
var buf = fs.readFileSync(inputFile, "utf8");

var result = sass.renderSync({
  data: buf,
  includePaths: ['app/styles/ember-power-calendar.scss']
});

fs.writeFileSync(outputFile, result.css);
