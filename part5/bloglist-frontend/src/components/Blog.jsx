import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setBlogDetailsVisible(!blogDetailsVisible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      <p>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{blogDetailsVisible ? 'hide' : 'view'}</button>
      </p>
      {blogDetailsVisible && (
        <div>
          <div>
            {blog.url}
          </div>
          <div>
            likes: {blog.likes}
            <button id= "likes" onClick={() => updateLikes(blog)}>like</button>
          </div>
          <div>
            <div>{blog.user ? blog.user.name : null}</div>
            {blog.user && user && blog.user.username === user.username ? (
              <button onClick={() => deleteBlog(blog)}>remove</button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog