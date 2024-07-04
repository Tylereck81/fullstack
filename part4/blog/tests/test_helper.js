const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs, nonExistingId, blogInDb
}