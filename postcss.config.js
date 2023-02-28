const cssVariables = require("postcss-css-variables");
module.exports = {
  plugins: [
    cssVariables({
      preserve: true,
    })
  ]
}