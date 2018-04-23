//Create a class Users what has 1 array of users
class Users
{
    //Constructor - declare empty array
    constructor()
    {
      this.users = [];
    }

    //Add to that particular array
    addUser(id, name, room)
    {
      var user = {id, name, room};
      this.users.push(user);
      return user;
    }

}


//Export
module.exports = {Users};
