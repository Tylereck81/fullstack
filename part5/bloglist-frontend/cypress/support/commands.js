Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
      cy.visit('')
    })
})
  
Cypress.Commands.add('addBlog',  ({ title, author, url }) => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('BACKEND')}/blogs`,
      body: { title, author, url },
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
      }
    })
    cy.visit('http://localhost:5173')
})