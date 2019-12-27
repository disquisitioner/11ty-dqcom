module.exports = function(eleventyConfig) {
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
