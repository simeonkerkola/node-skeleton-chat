class Users {
  constructor() {
    this.users = []
  }
  addUser(id, name, room) {
    const user = { id, name, room }
    this.users.push(user)
    return user
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
