
const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case ('SHOW_NOTIFICATION'):
      return action.data ? action.data.notification : null

    default: return state
  }
}

let lastTimeoutID = null
export const createNotification = (notification, seconds) => {
  return async dispatch => {
    clearTimeout(lastTimeoutID)
    dispatch({
      type: 'SHOW_NOTIFICATION',
      data: {
        notification
      }
    })
    lastTimeoutID = setTimeout(() => {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        data: null
      })
    }, seconds * 1000)
  }
}
export default notificationReducer