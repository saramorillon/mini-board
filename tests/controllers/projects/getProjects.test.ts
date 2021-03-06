import { getMockReq, getMockRes } from '@jest-mock/express'
import { getProjects } from '../../../src/controllers/projects/getProjects'
import { Project } from '../../../src/models/Project'
import { Release } from '../../../src/models/Release'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Project')
jest.mock('../../../src/models/Release')

describe('getProjects', () => {
  const req = getMockReq()
  const { res, clearMockRes } = getMockRes()

  let projectMock: RepoMock<Project>
  let releaseMock: RepoMock<Project>

  beforeEach(() => {
    clearMockRes()

    projectMock = mockRepository(Project.getRepository as jest.Mock)
    projectMock.find.mockResolvedValue([{ id: 'projectId' }])

    releaseMock = mockRepository(Release.getRepository as jest.Mock)
    releaseMock.findOne.mockResolvedValue(undefined)
  })

  it('should get projects', async () => {
    await getProjects(req, res)
    expect(projectMock.find).toHaveBeenCalledWith({ order: { name: 'ASC' }, relations: ['releases'] })
  })

  it('should render projects page with projects', async () => {
    await getProjects(req, res)
    expect(res.render).toHaveBeenCalledWith('Projects/Projects', { projects: [{ id: 'projectId' }], title: 'Projects' })
  })

  it('should render projects page with projects and projects releases', async () => {
    releaseMock.findOne.mockResolvedValue('release')
    await getProjects(req, res)
    expect(res.render).toHaveBeenCalledWith('Projects/Projects', {
      projects: [{ id: 'projectId', releases: ['release'] }],
      title: 'Projects',
    })
  })
})
