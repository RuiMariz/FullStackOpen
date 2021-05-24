describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Name',
      username: 'username',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Blogs')
  })

  it('login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
  })

  it('user can log in', function () {
    cy.contains('login')
    cy.get('#username').type('username')
    cy.get('#password').type('password')
    cy.get('#loginButton').click()
    cy.contains('Name logged in')
  })

  it('login fails with wrong password', function () {
    cy.contains('login').click()
    cy.get('#username').type('username')
    cy.get('#password').type('wrong')
    cy.get('#loginButton').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Name logged in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'username', password: 'password' })
    })

    it('a new blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('title')
      cy.get('#author').type('author')
      cy.get('#url').type('http://localhost:3000/')
      cy.get('#likes').type(10)
      cy.contains('save').click()
      cy.contains('title author')
    })

    describe('and a blog exists', function () {

      beforeEach(function () {
        cy.createBlog({
          title: 'another title',
          author: 'another author',
          url: 'http://localhost:3000/',
          likes: 5
        })
      })

      it('the user can like a blog', function () {
        cy.contains('show more').click()
        cy.get('.likeButton').click()
        cy.contains('likes 6')
      })

      it('the creator can delete a blog', function () {
        cy.contains('show more').click()
        cy.get('.removeButton').click()
        cy.contains('Blog deleted')
        cy.get('html').should('not.contain', 'another title another author')
      })

      it('users cant delete others blogs', function () {
        const user = {
          name: 'user2',
          username: 'username2',
          password: 'password2'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.get('.logoutButton').click()
        cy.login({ username: 'username2', password: 'password2' })

        cy.contains('show more').click()
        cy.get('html').should('not.contain', '.removeButton')
      })

      it('blogs are ordered by likes', function () {
        cy.createBlog({
          title: 'title3',
          author: 'another author',
          url: 'http://localhost:3000/',
          likes: 7
        })
        cy.createBlog({
          title: 'title2',
          author: 'another author',
          url: 'http://localhost:3000/',
          likes: 6
        })
        cy.contains('another title')
          .contains('show more')
          .click()
        cy.contains('title2')
          .contains('show more')
          .click()
        cy.contains('title3')
          .contains('show more')
          .click()

        cy.get('.blog').then(blogs => {
          expect(blogs[0].textContent).to.contain('title3')
          expect(blogs[1].textContent).to.contain('title2')
          expect(blogs[2].textContent).to.contain('another title')
        })

        for (let i = 1; i <= 5; i++) {
          cy.contains('another title')
            .contains('like')
            .click()
          cy.contains('another title')
            .contains(`likes ${5 + i}`)
        }
        for (let i = 1; i <= 3; i++) {
          cy.contains('title2')
            .contains('like')
            .click()
          cy.contains('title2')
            .contains(`likes ${6 + i}`)
        }

        cy.get('.blog').then(blogs => {
          expect(blogs[2].textContent).to.contain('title3')
          expect(blogs[1].textContent).to.contain('title2')
          expect(blogs[0].textContent).to.contain('another title')
        })
      })
    })
  })

})