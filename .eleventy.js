module.exports = function(eleventyConfig) {

  // Add some utility filters
  eleventyConfig.addFilter("dateDisplay", require("./utils/date.js") );

  // custom collection that sorts Applications alphabetically by title
  // Use: {%- for item in collections.appsAscending -%}
  // Assumes individual apps will be listed as *.html in the apps subfolder
  eleventyConfig.addCollection("appsAscending", (collection) =>
    collection.getFilteredByGlob("apps/*.html").sort((a, b) => {
      if (a.data.appTitle > b.data.appTitle) return 1;
      else if (a.data.appTitle < b.data.appTitle) return -1;
      else return 0;
    })
  );

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
