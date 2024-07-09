const BlogForm = ({ 
    addBlog, 
    handlesetTitle, 
    handlesetAuthor, 
    handlesetUrl, 
    newTitle, 
    newAuthor, 
    newUrl
}) => (
    <form onSubmit={addBlog}>
      <div>
        title:
          <input
          type="text"
          value={newTitle}
          name="Title"
          onChange={handlesetTitle}
        />
      </div>
      <div>
        author:
          <input
          type="text"
          value={newAuthor}
          name="Author"
          onChange={handlesetAuthor}
        />
      </div>
      <div>
        url:
          <input
          type="text"
          value={newUrl}
          name="url"
          onChange={handlesetUrl}
        />
      </div>
      <button type="submit">create</button>
    </form>  
)

export default BlogForm