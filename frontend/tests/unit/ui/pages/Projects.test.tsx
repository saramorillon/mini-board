import { screen } from '@testing-library/react'
import React from 'react'
import { getProjects } from '../../../../src/services/project'
import { Projects } from '../../../../src/ui/pages/Projects'
import { mock, mockProject, renderInRouter, wait } from '../../../mocks'

jest.mock('../../../../src/services/project')

describe('Projects', () => {
  beforeEach(() => {
    mock(getProjects).mockResolvedValue([mockProject()])
  })

  it('should render create button', async () => {
    renderInRouter(<Projects />)
    await wait()
    expect(screen.getByText('Create project')).toHaveAttribute('href', '/project')
  })

  it('should render project date', async () => {
    renderInRouter(<Projects />)
    await wait()
    expect(screen.getByText('Updated Jan 1, 2018')).toBeInTheDocument()
  })

  it('should render project title', async () => {
    renderInRouter(<Projects />)
    await wait()
    expect(screen.getByText('project1')).toHaveAttribute('href', '/project/1/issues')
  })

  it('should render project description', async () => {
    renderInRouter(<Projects />)
    await wait()
    expect(screen.getByText('description1')).toBeInTheDocument()
  })
})
