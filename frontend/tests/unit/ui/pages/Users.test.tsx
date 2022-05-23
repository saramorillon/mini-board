import { fireEvent, screen } from '@testing-library/react'
import React from 'react'
import { useSession } from '../../../../src/contexts/SessionContext'
import { deleteUser, getUsers } from '../../../../src/services/user'
import { Users } from '../../../../src/ui/pages/Users'
import { mock, mockUser, renderInRouter, wait } from '../../../mocks'

jest.mock('../../../../src/services/user')
jest.mock('../../../../src/contexts/SessionContext')

describe('Users', () => {
  beforeEach(() => {
    mock(useSession).mockReturnValue(mockUser())
    mock(getUsers).mockResolvedValue([mockUser()])
    mock(deleteUser).mockResolvedValue(undefined)
  })

  it('should render create button', async () => {
    renderInRouter(<Users />)
    await wait()
    expect(screen.getByText('Create user')).toHaveAttribute('href', '/user')
  })

  it('should render user name', async () => {
    renderInRouter(<Users />)
    await wait()
    expect(screen.getByText('user1')).toBeInTheDocument()
  })

  it('should render user created date', async () => {
    renderInRouter(<Users />)
    await wait()
    expect(screen.getByText('Created at 01/01/2018, 1:00 AM')).toBeInTheDocument()
  })

  it('should disable delete button if user is current user', async () => {
    renderInRouter(<Users />)
    await wait()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('should enable delete button if user is not current user', async () => {
    mock(getUsers).mockResolvedValue([mockUser({ username: 'user2' })])
    renderInRouter(<Users />)
    await wait()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should delete user when clicking on delete button', async () => {
    mock(getUsers).mockResolvedValue([mockUser({ username: 'user2' })])
    mock(deleteUser).mockReturnValue({ then: jest.fn().mockReturnValue({ finally: jest.fn() }) })
    renderInRouter(<Users />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(deleteUser).toHaveBeenCalledWith(mockUser({ username: 'user2' }))
  })

  it('should show loader when deleting', async () => {
    mock(getUsers).mockResolvedValue([mockUser({ username: 'user2' })])
    mock(deleteUser).mockReturnValue({ then: jest.fn().mockReturnValue({ finally: jest.fn() }) })
    renderInRouter(<Users />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.queryByRole('progressbar')).toBeInTheDocument()
  })

  it('should refresh users after deleting', async () => {
    mock(getUsers).mockResolvedValue([mockUser({ username: 'user2' })])
    renderInRouter(<Users />)
    await wait()
    mock(getUsers).mockClear()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(getUsers).toHaveBeenCalled()
  })
})