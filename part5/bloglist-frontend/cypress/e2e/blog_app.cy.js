describe('Blog app', function() {

  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const user = { 
      username: 'user1',
      password: 'user1password',
      name: 'User1'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('http://localhost:5173')

  })


  it('front page can be opened', function() {
    cy.visit('http://localhost:5173')
  })

  it ('Login form is shown', function () {
    cy.contains('log in to application').click()
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })


  it('succeeds with correct credentials', function () {
    cy.get('#username').type('user1')
    cy.get('#password').type('user1password')
    cy.get('#login').click()

    cy.contains('logged in')
    cy.contains('blogs')
  })

  it('fails with wrong credentials', function () {
    cy.get('#username').type('user2')
    cy.get('#password').type('user2password')
    cy.get('#login').click()

    cy.contains('Wrong username or password').should('have.css', 'color', 'rgb(255, 0, 0)')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'user1',
        password: 'user1password'
      })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()

      cy.get('#title').type('New Test Blog')
      cy.get('#author').type('New Author')
      cy.get('#url').type('http://tylertest.com')

      cy.get('#create').click()

      cy.contains('New Test Blog by New Author added')

      cy.contains('New Test Blog New Author')
      cy.contains('view').click()
      cy.contains('http://tylertest.com')
    })

    describe('After logged in user adds a blog', () => {
      beforeEach( function() {
        cy.addBlog({ title: 'New Test Blog', author: 'New Author', url: 'http://tylertest.com' })
      })

      it('blog can be liked ', function () {
        cy.contains('view').click()
        cy.get('#likes').click()
        cy.contains('likes: 1')
        cy.get('#likes').click()
        cy.contains('likes: 2')
      })

      it ('A blog can be removed', () => {
        cy.contains('view').click()
        cy.get('#remove').click()

        cy.contains('New Test Blog New Author').should('not.exist')
      })

      it ('Another user cannot see delete button for blog that is not theirs ', () => {
        cy.contains('logout').click()
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
          username: 'user2',
          password: 'user2password',
          name: 'user2'
        })

        cy.login({
          username: 'user2',
          password: 'user2password'
        })
        
        cy.contains('view').click()
        cy.get('#remove').should('not.exist')
      })

    })

  })



})