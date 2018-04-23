//Import expect for tests
const expect = require('expect');

//The users class on which we will run tests
const {Users} = require('./users.js');


//Describe it
describe('Testing Users', () => {

    //Before each for each execution of tests
    beforeEach(() => {
      users = new Users();
      users.users = [
        {
          id: '1',
          name: 'Stannis',
          room: 'Room 1',
        },
        {
          id: '2',
          name: 'TheMannis',
          room: 'Room 1',
        },
        {
          id: '3',
          name: 'John',
          room: 'Room 2',
        },
    ];
    });



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

  //Removing a user
  it('should remove a user', () => {
      var userId = '1';
      var user = users.removeUser(userId);

      expect(user.id).toBe(userId);
      expect(users.users.length).toBe(2);
    });

    //Not removing since no such id
    it('should not remove user', () => {
      var userId = '99';
      var user = users.removeUser(userId);

      expect(typeof user).toBe('undefined');
      expect(users.users.length).toBe(3);
    });


    //Should return since id is there
    it('should find user', () => {
      var userId = '2';
      var user = users.getUser(userId);

      expect(user.id).toBe(userId);
    });

    //Not since no ID
    it('should not find user', () => {
      var userId = '99';
      var user = users.getUser(userId);

      expect(typeof user).toBe('undefined');
    });

    //People from room 1
    it('should return names for Room 1', () => {
      var userList = users.getUserList('Room 1');

      expect(userList[0]).toEqual('Stannis');
      expect(userList[1]).toEqual('TheMannis');
    });

    it('should return names for Room 2', () => {
      var userList = users.getUserList('Room 2');

      expect(userList).toEqual(['John']);
    });



});
