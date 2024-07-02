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

module.exports = {
  dummy, 
  totalLikes, 
  favoriteBlog
}