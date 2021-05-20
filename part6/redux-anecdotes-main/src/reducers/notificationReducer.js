
const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case ('SHOW_NOTIFICATION'):
      return action.data ? action.data.notification : null

    default: return state
  }
}
export const createNotification = (notification, seconds) => {
  return async dispatch => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      data: {
        notification
      }
    })
    setTimeout(() => {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        data: null
      })
    }, seconds * 1000)
  }
}
export default notificationReducer