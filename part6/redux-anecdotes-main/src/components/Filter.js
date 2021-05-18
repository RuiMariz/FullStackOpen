import React from 'react'
import { useDispatch } from 'react-redux'
import { createFilter } from '../reducers/filterReducer'

const Filter = () => {

  const handleFilterChange = (filter) => {
    dispatch(createFilter(filter.target.value))
  }

  const dispatch = useDispatch()
  return (
    <div>
      filter shown with<input onChange={handleFilterChange} />
    </div>
  )
}

export default Filter