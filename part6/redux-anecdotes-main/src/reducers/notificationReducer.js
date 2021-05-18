
const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case ('SHOW_NOTIFICATION'):
      return action.data.notification

    default: return state
  }
}
export const createNotification = (notification) => {
  return {
    type: 'SHOW_NOTIFICATION',
    data: {
      notification
    }
  }
}

export const showNotification = (string, dispatch) => {
  dispatch(createNotification(string))
  setTimeout(() => {
    dispatch(createNotification(null))
  }, 5000)
}
export default notificationReducer