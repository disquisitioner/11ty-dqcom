const { DateTime } = require("luxon");

// Add a friendly date filter to nunjucks.
// Defaults to format of LLLL d, y, t, ZZ unless an
// alternate is passed as a parameter.
// {{ date | friendlyDate('OPTIONAL FORMAT STRING') }}
// List of supported tokens: https://moment.github.io/luxon/docs/manual/
//
// From Phil Hawksworth https://github.com/philhawksworth/eleventyone
// formatting.html#table-of-tokens

module.exports = function(dateObj, format= "ccc LLL d, y 'at' t (ZZZZZ)") {
	return DateTime.fromISO(dateObj,{setZone:true}).toFormat(format);
};

// (dateObj, format = "LLL d, y t, ZZ") => {
  // return DateTime.fromISO(dateObj,{setZone:true}).toFormat("LLL d, y t, ZZZZZ");