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

    //Get a user based on an id
    //Recall that someArray.filter((eachEntry) => someConditionWithEachEntry)
    //Will return an array of those results
    getUser(id)
    {
      return this.users.filter((user) => user.id === id)[0]; //Taking the first element
    }

    //Remove a user based on an id
    removeUser(id)
    {
      //First, obtain the said user
      var user = this.getUser(id);

      //If it did return something (not an empty array)
      if(user){
        this.users = this.users.filter((user) => user.id !== id);
      }

      return user;
    }

    //Get all of the users in a specific room
    getUserList(room)
    {
      //Get the users who fit the criteria
      var users = this.users.filter((user) => user.room === room);
      //And now we're just taking the names for this
      var namesArray = users.map((user) => user.name);
      return namesArray;
    }

}


//Export
module.exports = {Users};
