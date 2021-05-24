
const blogsReducer = (state = [], action) => {
  switch (action.type) {
  case ('INIT'):
    return action.data.sort((a, b) => a.likes < b.likes ? 1 : -1)
  case ('CREATE'):
    return [...state,action.data].sort((a, b) => a.likes < b.likes ? 1 : -1)
  case ('REMOVE'):
    return [...state].filter(blog => blog.id !== action.data.id)
  case ('UPDATE'):
    return state.map(blog => blog.id !== action.data.id ? blog : action.data).sort((a, b) => a.likes < b.likes ? 1 : -1)

  default: return state
  }
}
export const initBlogs = (blogs) => {
  return {
    type: 'INIT',
    data: blogs
  }
}

export const createBlog = (blog) => {
  return {
    type: 'CREATE',
    data: blog
  }
}

export const removeBlogRedux = (blog) => {
  return {
    type: 'REMOVE',
    data: blog
  }
}

export const updateBlogRedux = (blog) => {
  return {
    type: 'UPDATE',
    data: blog
  }
}

export default blogsReducer