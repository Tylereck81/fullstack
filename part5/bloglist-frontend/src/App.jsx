import { useState, useEffect } from 'react'
import Blog from './components/Blog'
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
  const [newTitle, setTitle] = useState([])
  const [newAuthor, setAuthor] = useState([])
  const [newUrl, setUrl] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [type, setType] = useState('')

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
  const addBlog = (event) =>{ 
    event.preventDefault() 
    const blogObject = {
      title: newTitle, 
      author: newAuthor, 
      url: newUrl
    }

    blogService
      .create(blogObject)
      .then(returnedBlog =>{ 
        setBlogs(blogs.concat(returnedBlog))
        console.log(returnedBlog)
        setTitle('')
        setAuthor('')
        setUrl('')
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

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
          <input
          type="text"
          value={newTitle}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
          <input
          type="text"
          value={newAuthor}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
          <input
          type="text"
          value={newUrl}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
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
      { blogForm() }

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App