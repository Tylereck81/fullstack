import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({type, message}) =>{ 
  if(message === null){ 
    return null
  }
  return (
    <div className={type}>
      {message} 
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [type, setType] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //adding a blog
  const addBlog = (blogObject) =>{ 
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog =>{ 
        setBlogs(blogs.concat(returnedBlog))
        setType('notif')
        setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error =>{ 
        setType('error')
        setErrorMessage(error.response.data.error)

        setTimeout(()=>{
          setErrorMessage(null)
          setType(null)
        },5000)
      })
  }

  //updating likes for blog
  const updateLikes = (blogObject) =>{ 
    const newBlog = { ... blogObject}
    const newLikes = newBlog.likes + 1
    console.log({...newBlog, likes: newLikes})
    blogService
      .update(blogObject.id, {...newBlog, likes: newLikes})
      .then(returnedBlog =>{ 
        console.log(returnedBlog)
        setBlogs((oldBlogs) =>
          oldBlogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
        )
      })
      .catch(error =>{ 
        setType('error')
        setErrorMessage(error.response.data.error)

        setTimeout(()=>{
          setErrorMessage(null)
          setType(null)
        },5000)
      })
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref = {blogFormRef}>
      <BlogForm addBlog={addBlog} />
    </Togglable>
  )


  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      console.log("LOL")
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setType('error')
      setUsername('')
      setPassword('')
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )


  const logOut = () =>{ 
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    console.log('logout')
  }

  if(user === null){ 
    return (
      <div>
        <Notification type ={type} message={errorMessage}/>
        <h2>log in to application </h2>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h1>blogs</h1>
      <Notification type ={type} message={errorMessage}/>

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
        </div>
      }

      <button onClick={() => logOut()}>
          logout
      </button>

      <h2>create new</h2>
      <div>
      { blogForm() }
      </div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes= {updateLikes}/>
      )}
    </div>
  )
}

export default App