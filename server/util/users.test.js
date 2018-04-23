//Import expect for tests
const expect = require('expect');

//The users class on which we will run tests
const {Users} = require('./users.js');


//Describe it
describe('Testing Users', () => {

    //Should add a new user
    it('Should add a new user', () => {
      var users = new Users();


    var user = {
      id: '123123123',
      name: 'First name',
      room: 'the chosen room'
    };

    //We should be getting the user back, since the addUser methods returns it
    var resUser = users.addUser(user.id, user.name, user.room);

    //In place array: [user]
    expect(users.users).toEqual([user]);

  });
});
