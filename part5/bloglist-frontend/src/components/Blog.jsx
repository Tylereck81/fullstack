import { useState } from 'react'

const Blog = ({ blog, updateLikes}) => {
  
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

  return(
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
            <button onClick={() => updateLikes(blog)}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog