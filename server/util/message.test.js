//Requiring expect for this
var expect = require('expect');
//The function we're about to test
var {generateMessage, generateLocationMessage} = require('./message');

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

//Testing the generateLocationMessage
describe('generateLocationMessage', () => {
  it('Should generate the correct message (with location)', () => {
    var from = 'Someone';
    var latitude = 15;
    var longitude = 20;
    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    var message = generateLocationMessage(from, latitude, longitude);

    //Expecting cases
    expect(typeof message.createdAt).toBe('number');
    expect(message.from).toEqual(from);
    expect(message.url).toBe(url);
  });
});
