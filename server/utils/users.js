class Users {
  constructor() {
    this.list = []
  }

  addUser(id, name, room) {
    const user = { id, name, room }
    this.list.push(user)
  }

  removeUser(id) {
    const user = this.getUser(id)

    if (user) {
      this.list = this.list.filter(each => each.id !== id)
    }
    return user
  }
  getUser(id) {
    return this.list.filter(user => user.id === id)[0]
  }
  getUserList(room) {
    // get all particular rooms users
    const users = this.list.filter(user => user.room === room)
    // take their names
    const namesArray = users.map(user => user.name)

    return namesArray
  }

  isValidUser(name) {
    if (!this.list.find(user => user.name.toLowerCase() === name.toLowerCase())) {
      return true
    }
    return false
  }
}

module.exports = { Users }

// class Person {
//   constructor(name, age) {
//     console.log(name, age)
//     this.name = name
//     this.age = age
//   }
//   getUserDescription() {
//     return `${this.name} is ${this.age} years old.`
//   }
// }
//
// const me = new Person('simi', 26)
// const description = me.getUserDescription()
// console.log(description)
