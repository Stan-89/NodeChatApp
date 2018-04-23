//We test the validation.js here

//Get the expect library
const expect = require('expect');

//The function we previously declared
const {isRealString} = require('./validation');

//Description of the whole section here
describe('Testing of is real string', () => {

  //Reject non string
  it('should reject non-string values', () => {
    var res = isRealString(98);
    expect(res).toBe(false);
  });

  //Reject non string
  it('It should reject the white spaces one', () => {
    var res = isRealString('   ');
    expect(res).toBe(false);
  });

  //Reject non string
  it('it should now allow "normal" strings', () => {
    var res = isRealString('Daa');
    expect(res).toBe(true);
  });

});
