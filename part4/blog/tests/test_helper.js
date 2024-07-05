const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Tyler Test Blog 1',
    author: 'Tyler Eck',
    url: 'https://tylertestblog.com',
    likes: 5
  },
  {
    title: 'Tyler Test Blog 2',
    author: 'Tyler Eck',
    url: 'https://tylertestblog.com',
    likes: 10
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'test',
    author: 'test',
    url: 'https://test.com',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogInDb, usersInDb
}