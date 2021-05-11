import React from 'react'
import Blog from './Blog'
const BlogsList = ({ blogs, updateBlog }) => (
    <div>
        <h2>Blogs</h2>
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
        )}
    </div>
)

export default BlogsList