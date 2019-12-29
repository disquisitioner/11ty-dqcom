module.exports = function(eleventyConfig) {

  // Add some utility filters
  eleventyConfig.addFilter("dateDisplay", require("./utils/date.js") );

  eleventyConfig.setTemplateFormats([
    "md",
    "html",
    "liquid",
    "css", // css is not yet a recognized template extension in Eleventy, will simply copy
    "js",
    "jpg",
    "png",
    "jpeg"
  ]);
};
