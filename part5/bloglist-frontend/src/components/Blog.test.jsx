import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('Blog render', function() {
  test('renders title and author, but does not render URL or likes by default', () => {
    const test_blog = {
      title: 'Test Blog',
      author: 'Tyler Test',
      url: 'https://tylertest.com',
      likes: 4,
    }

    render(<Blog blog={test_blog}/>)

    const titleElement = screen.getByText('Test Blog Tyler Test')
    const urlElement = screen.queryByText('https://tylertest.com')
    const likesElement = screen.queryByText('4')

    expect(titleElement).toBeDefined()
    expect(urlElement).not.toBeInTheDocument()
    expect(likesElement).not.toBeInTheDocument()
  })
})

