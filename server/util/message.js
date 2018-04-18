
//Exporting the function (stored in var) generateMessage
//that takes a from and a text and returns an object with a createdAt
var generateMessage = (from, text) => {
  return{
    from,
    text,
    createdAt: new Date().getTime()
  }
};

//Export the generateMessage var
module.exports = {generateMessage};
