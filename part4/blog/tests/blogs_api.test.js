const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

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

    test('suceeds with valid blog', async() =>{ 
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

    test('fails with status code 400 for missing  blog', async() =>{ 
        const missingAuthor = {
            title: "Invalid Blog",
            url: "ahajdshkf",
            likes: 50
        }

        await api
            .post('/api/blogs')
            .send(missingAuthor)
            .expect(400)
    
        const blogsAtEnd = await helper.blogInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('Likes property is missing, defaults to 0', async () => {
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

after(async () => {
  await mongoose.connection.close()
})

