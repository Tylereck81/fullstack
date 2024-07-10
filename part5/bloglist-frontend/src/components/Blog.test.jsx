import React from 'react'
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

  test('renders URL and likes when details button is clicked', async () => {
    const test_blog = {
      title: 'Test Blog',
      author: 'Tyler Test',
      url: 'https://tylertest.com',
      likes: 4,
      user: {
        name: 'User Test',
        username: 'tyler'
      }
    }

    render(<Blog blog={test_blog} />)

    const user = userEvent.setup()
    const showDetailsButton = screen.getByText('view')
    await user.click(showDetailsButton)

    const urlElement = screen.getByText('https://tylertest.com')
    const likesElement = screen.getByText('4', { exact: false })

    expect(urlElement).toBeInTheDocument()
    expect(likesElement).toBeInTheDocument()
  })

  test('like button handler is called twice when button is clicked twice ', async () => {
    const test_blog = {
      title: 'Test Blog',
      author: 'Tyler Test',
      url: 'https://tylertest.com',
      likes: 4,
      user: {
        name: 'User Test',
        username: 'tyler'
      }
    }

    const mockHandler = vi.fn()

    render(<Blog blog={test_blog} updateLikes={mockHandler} />)

    const user = userEvent.setup()
    const showDetailsButton = screen.getByText('view')
    await user.click(showDetailsButton)

    const likesButton = screen.getByText('like')
    await user.click(likesButton)
    await user.click(likesButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

