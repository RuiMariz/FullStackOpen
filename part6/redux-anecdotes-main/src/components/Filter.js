import React from 'react'
import { connect } from 'react-redux'
import { createFilter } from '../reducers/filterReducer'

const Filter = (props) => {

  const handleFilterChange = (event) => {
    props.createFilter(event.target.value)
  }

  return (
    <div>
      filter shown with<input onChange={handleFilterChange} />
    </div>
  )
}
const mapDispatchToProps = {
  createFilter
}

export default connect(null, mapDispatchToProps)(Filter)