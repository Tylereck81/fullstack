const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () =>{ 
    
    test('blogs are returned as json', async() =>{ 
        await api
        .get('/api/blogs')
        .expect(200) 
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned',async() => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blogs have a property named id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body

        blogs.forEach(blog =>{ 
            assert(blog.id!== undefined)
            assert(blog._id === undefined)
        })
    })

})

describe('when a new blog is added', () =>{ 

    test('suceeds with adding a valid blog', async() =>{ 
        const newBlog = {
            title: "Valid Blog",
            author: "Tyler Eck",
            url: "http://tylervalidblog.com",
            likes: 33,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        assert(titles.includes('Valid Blog'))
    })

    test('fails with status code 400 for missing blog title', async() =>{ 
        const missingTitle = {
            author: "Tyler",
            url: "ahajdshkf",
            likes: 50
        }

        await api
            .post('/api/blogs')
            .send(missingTitle)
            .expect(400)
    
        const blogsAtEnd = await helper.blogInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 for missing blog url', async() =>{ 
        const missingUrl = {
            author: "Tyler",
            title: "Tyler without URL",
            likes: 50
        }

        await api
            .post('/api/blogs')
            .send(missingUrl)
            .expect(400)
    
        const blogsAtEnd = await helper.blogInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })


    test('succeeds even when likes property is missing, defaults to 0', async () => {
        const missingLikes = {
            title: 'Blog missing likes',
            author: 'Tyler',
            url: 'https://tyler.com'
        }
    
        await api
            .post('/api/blogs')
            .send(missingLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

})

describe('when a blog is deleted', () =>{ 
    test('suceeds with deleting a valid blog', async() =>{ 

        const blogStart = await helper.blogInDb()
        const blogtoDelete = blogStart[0]

        await api
            .delete(`/api/blogs/${blogtoDelete.id}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('fails when deleting a blog not found', async() =>{ 

        const blogtoDeleteID = 1

        await api
            .delete(`/api/blogs/${blogtoDeleteID}`)
            .expect(400)
    
        const blogsAtEnd = await helper.blogInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

})

describe('when updating a blog', () => {
    test('updating likes on blog', async() => {

        const blogs = await helper.blogInDb()
        const blogtoUpdate = blogs[0]
        const oldLikes = blogtoUpdate.likes

        blogtoUpdate.likes = blogtoUpdate.likes + 1
        await api
            .put(`/api/blogs/${blogtoUpdate.id}`)
            .send(blogtoUpdate)
            .expect(201)

        assert.strictEqual(blogtoUpdate.likes, oldLikes +1)
    })
})


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  
})


describe('when updating a blog', () => {
    test('creation fails with missing username', async () => {
        const newUser = {
            name: 'John Doe',
            password: 'password123',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(response.body.error.includes('username` is required'))
    })

    test('creation fails with short username', async () => {
        const newUser = {
            username: 'us',
            name: 'John Doe',
            password: 'password123',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(response.body.error.includes('is shorter than the minimum allowed length'))
    })

    test('creation fails with no password', async () => {
        const newUser = {
            username: 'johndoe',
            name: 'John Doe',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        assert(response.body.error.includes('Password is required'))
    })

    test('creation fails with short password', async () => {
        const newUser = {
            username: 'johndoe',
            name: 'John Doe',
            password: 'pw', // Short password
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(response.body.error.includes('Password is too short'))
    })

    test('creation fails when username has already been taken', async () => {
        const newUser = {
            username: 'tyler', // An existing username
            name: 'tyler',
            password: 'password',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        

        assert(response.body.error.includes('expected `username` to be unique'))
    })

})


after(async () => {
  await mongoose.connection.close()
})

