import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newTitle, setTitle] = useState([])
  const [newAuthor, setAuthor] = useState([])
  const [newUrl, setUrl] = useState([])
  //adding a blog
  const createBlog = (event) => {
    event.preventDefault()

    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return(
    <form onSubmit={createBlog}>
      <div>
        <label htmlFor="title">title:</label>
        <input
          id='title'
          className='title'
          type="text"
          value={newTitle}
          name="Title"
          onChange={event => setTitle(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">author:</label>
        <input
          id='author'
          className='author'
          type="text"
          value={newAuthor}
          name="Author"
          onChange={event => setAuthor(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">url:</label>
        <input
          id='url'
          className='url'
          type="text"
          value={newUrl}
          name="url"
          onChange={event => setUrl(event.target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm