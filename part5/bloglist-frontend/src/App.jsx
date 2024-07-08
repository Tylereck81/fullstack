import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({message}) =>{ 
  if(message === null){ 
    return null
  }
  return (
    <div className='error'>
      {message} 
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
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
      content: newNote, 
      important: Math.random() < 0.5
    }

    blogService
      .create(blogObject)
      .then(returnedBlog =>{ 
        setBlogs(notes.concat(returnedNote))
        setNewNote('')
      })
  }


  const handleNewNote = (event) =>{ 
    console.log(event.target.value)
    setNewNote(event.target.value)
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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
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
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
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
        <h2>log in to application </h2>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={errorMessage}/>

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
        </div>
      }

      <button onClick={() => logOut()}>
          logout
      </button>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App