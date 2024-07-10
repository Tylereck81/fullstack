describe('Blog app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5173')
  })

  it ('Login form is shown', function () {
    cy.visit('http://localhost:5173')
    cy.contains('log in to application').click()
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

})