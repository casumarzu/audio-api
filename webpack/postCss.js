// Post-css
var precss = require('precss'),
    pxtorem = require('postcss-pxtorem'),
    postcssShort = require('postcss-short'),
    postcssSorting = require('postcss-sorting'),
    postcssCssnext = require('postcss-cssnext'),
    rucksackcss = require('rucksack-css'),
    postcssCustomSelectors = require('postcss-custom-selectors'),
    postcssGrid = require('postcss-grid'),
    cssnano = require('cssnano'),
    stylelint = require('stylelint');

var postcssArr = [
  precss,
  postcssShort,
  postcssSorting,
  postcssCssnext,
  rucksackcss,
  postcssCustomSelectors,
  postcssGrid,
  cssnano
];

module.exports = postcssArr;
