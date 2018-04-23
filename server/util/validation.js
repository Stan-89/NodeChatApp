//Function that validates if a certain (type) string is a "real" string
//So we check if of type string and, if ater trimmed, it has at least 1 character
//Then we export it
var isRealString = (stringArgument) => {
  return typeof stringArgument === 'string' && stringArgument.trim().length > 0;
};

module.exports = {isRealString};
