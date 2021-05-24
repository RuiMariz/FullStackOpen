const lodash = require('lodash');
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.map(blog => blog.likes).
        reduce((accumulator, currentValue) => accumulator + currentValue, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0)
        return null
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const blog = blogs.find(blog => blog.likes === maxLikes)
    return ({
        title: blog.title,
        author: blog.author,
        likes: blog.likes
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0)
        return null
    const groups = lodash.groupBy(blogs, (blog) => blog.author)
    const mapped = lodash.mapValues(groups, (group) => group.length)
    const entries = Object.entries(mapped)
    const blog = entries.reduce((acc, curr) => acc[1] > curr[1] ? acc : curr, 0)
    return ({ author: blog[0], blogs: blog[1] })
}

const mostLikes = (blogs) => {
    if (blogs.length === 0)
        return null
    const groups = lodash.groupBy(blogs, (blog) => blog.author)
    const mapped = lodash.mapValues(groups, (group) =>
        (group.map(m => m.likes)).reduce((acc, curr) => acc + curr, 0))
    const entries = Object.entries(mapped)
    const author = (entries.reduce((acc, curr) => acc[1] > curr[1] ? acc : curr, 0))
    return ({ author: author[0], likes: author[1] })
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}