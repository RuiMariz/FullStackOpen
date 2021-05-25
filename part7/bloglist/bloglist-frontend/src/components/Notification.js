import React from 'react'
import { useSelector } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'

export const showErrorMessage = (string,dispatch) => {
  showNotification(string, 'error', dispatch)
}

export const showSuccessMessage = (string,dispatch) => {
  showNotification(string, 'success', dispatch)
}

const Notification = () => {
  const notification = useSelector(state => state.notification)
  return (
    notification !== null ?
      <div className={notification.type}>
        {notification.message}
      </div>
      : null
  )
}

export default Notification