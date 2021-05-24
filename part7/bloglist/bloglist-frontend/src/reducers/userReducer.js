
const userReducer = (state = null, action) => {
  switch (action.type) {
  case ('LOG_IN'):
    return action.data
  case ('LOG_OUT'):
    return null

  default: return state
  }
}
export const logInUser = (user) => {
  return {
    type: 'LOG_IN',
    data: user
  }
}

export const logOutUser = () => {
  return {
    type: 'LOG_OUT'
  }
}

export default userReducer