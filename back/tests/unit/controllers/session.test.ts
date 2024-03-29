import { getSession, login, logout } from '../../../src/controllers/session'
import { prisma } from '../../../src/prisma'
import { getMockReq, getMockRes, mockAction, mockSession, mockUser } from '../../mocks'

describe('login', () => {
  beforeEach(() => {
    vi.spyOn(prisma.user, 'findFirstOrThrow').mockResolvedValue(mockUser())
  })

  it('should get user', async () => {
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { res } = getMockRes()
    await login(req, res)
    expect(prisma.user.findFirstOrThrow).toHaveBeenCalledWith({
      where: { username: 'username', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' },
    })
  })

  it('should set session user', async () => {
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { res } = getMockRes()
    await login(req, res)
    expect(req.session.user).toEqual(mockSession())
  })

  it('should send 204 when login succeeds', async () => {
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { res } = getMockRes()
    await login(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should send 401 when login fails', async () => {
    vi.spyOn(prisma.user, 'findFirstOrThrow').mockRejectedValue('Error')
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { res } = getMockRes()
    await login(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should log success', async () => {
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await login(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.user, 'findFirstOrThrow').mockRejectedValue('Error')
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await login(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('getSession', () => {
  it('should return session user', () => {
    const req = getMockReq()
    const { res } = getMockRes()
    getSession(req, res)
    expect(res.json).toHaveBeenCalledWith(mockSession())
  })
})

describe('logout', () => {
  it('should destroy session', () => {
    const req = getMockReq()
    req.session.destroy = vi.fn().mockImplementation((fn) => fn())
    const { res } = getMockRes()
    logout(req, res)
    expect(req.session.destroy).toHaveBeenCalled()
  })

  it('should clear cookie', () => {
    const req = getMockReq()
    req.session.destroy = vi.fn().mockImplementation((fn) => fn())
    const { res } = getMockRes()
    logout(req, res)
    expect(res.clearCookie).toHaveBeenCalledWith('cookie_name')
  })

  it('should redirect to app host', () => {
    const req = getMockReq()
    req.session.destroy = vi.fn().mockImplementation((fn) => fn())
    const { res } = getMockRes()
    logout(req, res)
    expect(res.redirect).toHaveBeenCalledWith('http://app_host.io')
  })

  it('should log success', () => {
    const req = getMockReq()
    req.session.destroy = vi.fn().mockImplementation((fn) => fn())
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    logout(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', () => {
    const req = getMockReq()
    req.session.destroy = vi.fn().mockImplementation((fn) => fn('error'))
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    logout(req, res)
    expect(failure).toHaveBeenCalledWith('error')
  })
})
