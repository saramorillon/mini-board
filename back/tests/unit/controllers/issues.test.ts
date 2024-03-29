import { deleteIssue, getIssue, getIssues, moveIssues, patchIssue, postIssue } from '../../../src/controllers/issues'
import { prisma } from '../../../src/prisma'
import { getMockReq, getMockRes, mockAction, mockIssue } from '../../mocks'

describe('getIssues', () => {
  beforeEach(() => {
    vi.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue()])
    vi.spyOn(prisma.issue, 'count').mockResolvedValue(1)
  })

  it('should get issues', async () => {
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(prisma.issue.findMany).toHaveBeenCalledWith({
      where: { projectId: 1, releaseId: 1 },
      orderBy: [{ release: { dueDate: 'desc' } }, { priority: 'asc' }],
      include: { author: true, project: true, release: true },
      take: 10,
      skip: 10,
    })
  })

  it('should count issues', async () => {
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(prisma.issue.count).toHaveBeenCalledWith({ where: { projectId: 1, releaseId: 1 } })
  })

  it('should return issues', async () => {
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(res.json).toHaveBeenCalledWith({ issues: [mockIssue()], total: 1 })
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.issue, 'findMany').mockRejectedValue('Error')
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.issue, 'findMany').mockRejectedValue('Error')
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('postIssue', () => {
  beforeEach(() => {
    vi.spyOn(prisma.issue, 'create').mockResolvedValue(mockIssue())
    vi.spyOn(prisma.issue, 'aggregate').mockResolvedValue({ _max: { priority: 7 } } as never)
  })

  it('should create issue with max priority', async () => {
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(prisma.issue.create).toHaveBeenCalledWith({
      data: {
        authorId: 1,
        projectId: 1,
        releaseId: 1,
        priority: 8,
        type: 'bug',
        status: 'todo',
        points: 1,
        title: 'title',
        description: 'description',
      },
    })
  })

  it('should create issue with default 0 priority', async () => {
    vi.spyOn(prisma.issue, 'aggregate').mockResolvedValue({ _max: {} } as never)
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(prisma.issue.create).toHaveBeenCalledWith({
      data: {
        authorId: 1,
        projectId: 1,
        releaseId: 1,
        priority: 1,
        type: 'bug',
        status: 'todo',
        points: 1,
        title: 'title',
        description: 'description',
      },
    })
  })

  it('should return 201 status and created issue id', async () => {
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.issue, 'create').mockRejectedValue('Error')
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
    })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.issue, 'create').mockRejectedValue('Error')
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
    })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('getIssue', () => {
  beforeEach(() => {
    vi.spyOn(prisma.issue, 'findUnique').mockResolvedValue(mockIssue())
  })

  it('should get issue', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return issue', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(res.json).toHaveBeenCalledWith(mockIssue())
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.issue, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.issue, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('patchIssue', () => {
  beforeEach(() => {
    vi.spyOn(prisma.issue, 'update').mockResolvedValue(mockIssue())
  })

  it('should update issue', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(prisma.issue.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        authorId: 1,
        releaseId: 1,
        type: 'bug',
        status: 'todo',
        points: 1,
        title: 'title',
        description: 'description',
      },
    })
  })

  it('should return 200 status and updated issue id', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.issue, 'update').mockRejectedValue('Error')
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
    })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.issue, 'update').mockRejectedValue('Error')
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
    })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('deleteIssue', () => {
  beforeEach(() => {
    vi.spyOn(prisma.issue, 'delete').mockResolvedValue(mockIssue())
  })

  it('should delete issue', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(prisma.issue.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.issue, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.issue, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('moveIssue', () => {
  beforeEach(() => {
    vi.spyOn(prisma.issue, 'findUnique').mockResolvedValue(null)
    vi.spyOn(prisma.issue, 'findMany').mockResolvedValue([])
    vi.spyOn(prisma.issue, 'update').mockResolvedValue(mockIssue())
  })

  it('should get source issue', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should get target issue', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 2 } })
  })

  it('should do nothing if source issue is not found', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).not.toHaveBeenCalled()
  })

  it('should do nothing if target issue is not found', async () => {
    vi.spyOn(prisma.issue, 'findUnique').mockResolvedValueOnce(mockIssue())
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).not.toHaveBeenCalled()
  })

  it('should save all issues with updated release and priority', async () => {
    const issues = [
      mockIssue(),
      mockIssue({ id: 2, releaseId: 1, priority: 1 }),
      mockIssue({ id: 3, releaseId: 2 }),
      mockIssue({ id: 4, releaseId: 2, priority: 1 }),
    ]
    vi.spyOn(prisma.issue, 'findUnique').mockResolvedValueOnce(issues[0]).mockResolvedValueOnce(issues[2])
    vi.spyOn(prisma.issue, 'findMany').mockResolvedValue(issues)
    const req = getMockReq({ body: { sourceId: 1, targetId: 3 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { priority: 1, releaseId: 2 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 2 }, data: { priority: 0, releaseId: 1 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 3 }, data: { priority: 0, releaseId: 2 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { priority: 2, releaseId: 2 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.issue, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.issue, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})
