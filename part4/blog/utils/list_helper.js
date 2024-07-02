const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => { 
  return blogs.reduce((total, blog) => total + blog.likes, 0)
} 

const favoriteBlog = (blogs) => {
  let max = -1000;
  let maxLikedBlog = {};

  for (const b of blogs) {

    if (b.likes > max) {
      max = b.likes;
      maxLikedBlog = b;

    }
  }
  return maxLikedBlog;
}

const mostBlogs = (blogs) =>{ 
  const groupByAuthor = lodash.groupBy(blogs, 'author');

  const topAuthor = lodash.maxBy(Object.keys(groupByAuthor), author => lodash.get(groupByAuthor[author],'length',0))

  return {
      author: topAuthor,
      blogs: lodash.get(groupByAuthor[topAuthor],'length',0)
  };
}

module.exports = {
  dummy, 
  totalLikes, 
  favoriteBlog, 
  mostBlogs
}