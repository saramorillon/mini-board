import { useDrag, useDrop } from '@saramorillon/hooks'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Ticket } from '../../../../src/ui/components/Ticket'
import { mock, mockIssueFull } from '../../../mocks'

jest.mock('@saramorillon/hooks')

describe('Ticket', () => {
  beforeEach(() => {
    mock(useDrop).mockReturnValue([false])
    mock(useDrag).mockReturnValue([false])
  })

  it('should set issue as drag event data', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(useDrag).toHaveBeenCalledWith(JSON.stringify(mockIssueFull()))
  })

  it('should not render issue if status does not match', () => {
    render(<Ticket status="done" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.queryByText('description1')).not.toBeInTheDocument()
  })

  it('should not be draggable if status does not match', () => {
    render(<Ticket status="done" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveAttribute('draggable', 'false')
  })

  it('should have an opacity of 0 by default if status does not match', () => {
    render(<Ticket status="done" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveStyle({ opacity: 0 })
  })

  it('should have an opacity of 0.7 when hovering element if status does not match', () => {
    mock(useDrop).mockReturnValue([true])
    render(<Ticket status="done" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveStyle({ opacity: 0.7 })
  })

  it('should have an opacity of 0 when not hovering element if status does not match', () => {
    mock(useDrop).mockReturnValue([false])
    render(<Ticket status="done" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveStyle({ opacity: 0 })
  })

  it('should render issue if status does match', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByText('description1')).toBeInTheDocument()
  })

  it('should be draggable if status does match', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveAttribute('draggable', 'true')
  })

  it('should have an opacity of 1 by default if status does match', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveStyle({ opacity: 1 })
  })

  it('should have an opacity of 0.5 when element is dragged if status does match', () => {
    mock(useDrag).mockReturnValue([true])
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveStyle({ opacity: 0.5 })
  })

  it('should have an opacity of 1 when element is not dragged if status does match', () => {
    mock(useDrag).mockReturnValue([false])
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveStyle({ opacity: 1 })
  })

  it('should render blue card when hovering element', () => {
    mock(useDrop).mockReturnValue([true])
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveClass('over')
  })

  it('should render red card for bugs', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveClass('bug')
  })

  it('should render yellow card for features', () => {
    render(<Ticket status="doing" issue={mockIssueFull({ type: 'feature' })} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByTestId('ticket')).toHaveClass('feature')
  })

  it('should move issue when dropping', () => {
    mock(useDrop).mockImplementation((dropHandler) => {
      dropHandler('{"id":"1"}')
      return []
    })
    const onMove = jest.fn()
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={onMove} />)
    expect(onMove).toHaveBeenCalledWith({ id: '1' }, mockIssueFull(), 'doing')
  })

  it('should render issue link', () => {
    render(<Ticket status="doing" issue={mockIssueFull()} projectId={1} onMove={jest.fn()} />)
    expect(screen.getByText('[P1-1] title1')).toHaveAttribute('href', '/project/1/issue/1')
  })
})
