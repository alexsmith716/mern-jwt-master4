
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [
        'last 2 versions',
        'IE >= 9',
        'safari >= 8'
      ]
    })
  ]
};

// PostCSS is a tool for transforming styles with JS plugins.

// These 200 plugins can:
//    lint your CSS
//    support variables and mixins
//    transpile future CSS syntax, inline images, and more.

// autoprefixer: A plugin to parse CSS and add VENDOR prefixes to CSS rules using values from:
//    http://caniuse.com/.

// Write your CSS rules without VENDOR prefixes (in fact, forget about them entirely):

// :fullscreen a {
//    display: flex
// }

// Autoprefixer will use the data based on current browser popularity & property support
// AND apply prefixes for you

// :-webkit-full-screen
// :-moz-full-screen
// :-ms-fullscreen

// Working with Autoprefixer is simple: 
//  just forget about vendor prefixes and write normal CSS according to the latest W3C specs. 
//  You don’t need a special language (like Sass) or remember where you must use mixins.

// Autoprefixer supports selectors (like :fullscreen and ::selection), 
//  unit function (calc()), at‑rules (@supports and @keyframes) and properties.

// Because Autoprefixer is a postprocessor for CSS, 
//  you can also use it with preprocessors such as Sass, Stylus or LESS.

// https://github.com/postcss/autoprefixer