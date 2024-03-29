import { render, renderHook, screen } from '@testing-library/react'
import React from 'react'
import { SessionContext, SessionProvider, useSession } from '../../../src/contexts/SessionContext'
import { getSession } from '../../../src/services/session'
import { mockSession, wait } from '../../mocks'

vi.mock('../../../src/services/session')

describe('SessionContext', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockResolvedValue(mockSession())
  })

  it('should show loader when loading', async () => {
    render(<SessionProvider></SessionProvider>)
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
    await wait()
  })

  it('should render children', async () => {
    render(<SessionProvider>In provider</SessionProvider>)
    await wait()
    expect(screen.getByText('In provider')).toBeInTheDocument()
  })

  it('should return session', async () => {
    render(
      <SessionProvider>
        <SessionContext.Consumer>{(value) => <>{value?.id}</>}</SessionContext.Consumer>
      </SessionProvider>
    )
    await wait()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})

describe('useSession', () => {
  it('should throw if context is used outside a Provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => renderHook(() => useSession())).toThrow(new Error('Cannot use session outside SessionContext'))
  })

  it('should return session', () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => <SessionContext.Provider value={mockSession()}>{children}</SessionContext.Provider>,
    })
    expect(result.current).toEqual(mockSession())
  })
})
