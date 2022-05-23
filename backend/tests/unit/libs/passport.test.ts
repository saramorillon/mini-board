import { deserializeUser, localStrategy, serializeUser } from '../../../src/libs/passport'
import { prisma } from '../../../src/prisma'
import { mockUser } from '../../mocks'

describe('passport', () => {
  describe('serializeUser', () => {
    it('should return user id', () => {
      const done = jest.fn()
      serializeUser(mockUser, done)
      expect(done).toHaveBeenCalledWith(null, 1)
    })
  })

  describe('deserializeUser', () => {
    it('should return user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser)
      const done = jest.fn()
      await deserializeUser(1, done)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(done).toHaveBeenCalledWith(null, mockUser)
    })

    it('should return error if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)
      const done = jest.fn()
      await deserializeUser(1, done)
      expect(done).toHaveBeenCalledWith('User not found')
    })

    it('should catch errors', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error('500'))
      const done = jest.fn()
      await deserializeUser(1, done)
      expect(done).toHaveBeenCalledWith(new Error('500'))
    })
  })

  describe('localStrategy', () => {
    it('should return user', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser)
      const done = jest.fn()
      await localStrategy('username', 'tutu', done)
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          username: 'username',
          password: 'eb0295d98f37ae9e95102afae792d540137be2dedf6c4b00570ab1d1f355d033',
        },
      })
      expect(done).toHaveBeenCalledWith(null, mockUser)
    })

    it('should return error if no user was found', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null)
      const done = jest.fn()
      await localStrategy('username', 'tutu', done)
      expect(done).toHaveBeenCalledWith(new Error('User not found'))
    })

    it('should catch errors', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockRejectedValue(new Error('500'))
      const done = jest.fn()
      await localStrategy('username', 'tutu', done)
      expect(done).toHaveBeenCalledWith(new Error('500'))
    })
  })
})