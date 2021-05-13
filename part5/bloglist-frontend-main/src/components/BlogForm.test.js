import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const input = component.container.querySelector('input')
  const form = component.container.querySelector('form')

  fireEvent.change(input, {
    target: { value: 'title' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title')
})

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const form = component.container.querySelector('form')
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const likes = component.container.querySelector('#likes')

  fireEvent.change(title, { target: { value: 'titleTest' } })
  fireEvent.change(author, { target: { value: 'authorTest' } })
  fireEvent.change(url, { target: { value: 'http://localhost:3000/' } })
  fireEvent.change(likes, { target: { value: 10 } })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('titleTest')
  expect(createBlog.mock.calls[0][0].author).toBe('authorTest')
  expect(createBlog.mock.calls[0][0].url).toBe('http://localhost:3000/')
  expect(createBlog.mock.calls[0][0].likes).toBe('10')
})