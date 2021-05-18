
const filterReducer = (state = null, action) => {
  switch (action.type) {
    case ('FILTER'):
      return action.data.filter

    default: return state
  }
}
export const createFilter = (filter) => {
  return {
    type: 'FILTER',
    data: {
      filter
    }
  }
}

export default filterReducer