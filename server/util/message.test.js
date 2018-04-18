//Requiring expect for this
var expect = require('expect');
//The function we're about to test
var {generateMessage} = require('./message');

//We're testing generate message
describe('generateMessage', () => {
  it('should generate a msg object', () => {
    var from = 'Stan';
    var text = 'Some message is here';
    var message = generateMessage(from, text);

    //Expects: to be a number for createdAt
    expect(typeof message.createdAt).toBe('number');
    //To have the following
    expect(message.from).toEqual(from);
    expect(message.text).toEqual(text);
  });
});
