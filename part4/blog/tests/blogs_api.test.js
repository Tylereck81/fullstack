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



after(async () => {
  await mongoose.connection.close()
})

