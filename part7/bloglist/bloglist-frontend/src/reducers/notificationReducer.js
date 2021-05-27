
const notificationReducer = (state = { message: '', type: '' }, action) => {
  switch (action.type) {
  case ('SHOW_NOTIFICATION'):
    return action.data

  default: return state
  }
}
export const createNotification = (notification, type) => {
  return {
    type: 'SHOW_NOTIFICATION',
    data: {
      message: notification,
      type: type
    }
  }
}

let previousTimeoutID = null

export const showNotification = (message, type, dispatch) => {
  dispatch(createNotification(message, type))
  clearTimeout(previousTimeoutID)
  previousTimeoutID = setTimeout(() => {
    dispatch(createNotification('', ''))
  }, 5000)
}
export default notificationReducer