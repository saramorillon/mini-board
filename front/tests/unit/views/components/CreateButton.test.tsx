import { render, screen } from '@testing-library/react'
import React from 'react'
import { CreateButton } from '../../../../src/views/components/CreateButton'

describe('CreateButton', () => {
  it('should render button', () => {
    render(<CreateButton to="/to">Click me!</CreateButton>)
    expect(screen.getByText('Click me!')).toHaveAttribute('href', '/to')
  })
})
