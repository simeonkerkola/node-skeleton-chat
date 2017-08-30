const expect = require('expect')

const { Users } = require('./users')

describe('Users', () => {
  const users = new Users()

  beforeEach(() => {
    users.list = [
      {
        id: '1',
        name: 'User1',
        room: 'Node Course',
      }, {
        id: '2',
        name: 'User2',
        room: 'React Course',
      }, {
        id: '3',
        name: 'User3',
        room: 'Node Course',
      },
    ]
  })

  it('should add new user', () => {
    const user4 = {
      id: '4',
      name: 'User4',
      room: 'Node Course',
    }
    users.addUser(user4.id, user4.name, user4.room)
    expect(users.list[3]).toEqual(user4)
  })

  it('should remove a user', () => {
    const userId = '2'
    const user = users.removeUser(userId)

    expect(user.id).toBe(userId)
    expect(users.list.length).toBe(2)
  })

  it('should not remove a user', () => {
    const userId = '66'
    const user = users.removeUser(userId)

    expect(user).toNotExist()
    expect(users.list.length).toBe(3)
  })

  it('should find a user', () => {
    const userId = '3'
    const user = users.getUser(userId)
    expect(user.id).toBe(userId)
  })

  it('should not find a user', () => {
    const id = '66'
    const user = users.getUser(id)
    expect(user).toNotExist()
  })

  it('should return names for node course', () => {
    const userList = users.getUserList('Node Course')

    expect(userList).toEqual(['User1', 'User3'])
  })

  it('should reject same username', () => {
    const user5 = {
      id: '5',
      name: 'User1',
      room: 'Angular Course'
    }
    users.addUser(user5.id, user5.name, user5.room)
    console.log(users)

    expect(users.list.length).toBe(3)
  })
})
