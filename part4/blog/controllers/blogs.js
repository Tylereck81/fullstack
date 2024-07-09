const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('./../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username: 1, name: 1, id: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  }
  else{
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  
  const user = request.user

  const blog = await Blog.findById(request.params.id).populate('user')

  if (!blog){
    return response.status(404).json({error: 'Blog does not exist'}
    )
  }

  if (blog.user.id.toString() !== user.id.toString()){
    return response.status(401).json({ error: 'Unauthorized to delete blog'})
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()

})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  
  const user = request.user

  const blog = new Blog({ 
    title: body.title, 
    author: body.author, 
    url: body.url, 
    likes: body.likes, 
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const newTitle = request.body.title
  const newAuthor = request.body.author
  const newURL = request.body.url
  const newLikes = request.body.likes
  
  const updatedBlog = await Blog.findByIdAndUpdate( request.params.id, { title: newTitle, author: newAuthor, url: newURL, likes: newLikes }, { new: true, runValidators: true, context: 'query' }).populate('user',{username: 1, name: 1, id: 1})
  response.status(201).json(updatedBlog)
})


module.exports = blogsRouter

// {
//   "title": "Tyler Test Blog 3",
//   "author": "Tyler Eck",
//   "url": "https://tylertestblog.com",
//   "likes": 14
// } 