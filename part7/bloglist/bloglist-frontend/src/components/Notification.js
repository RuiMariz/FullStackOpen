import React from 'react'
import { useSelector } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { Alert } from '@material-ui/lab'
import { Snackbar,Slide } from '@material-ui/core'

export const showErrorMessage = (string, dispatch) => {
  showNotification(string, 'error', dispatch)
}

export const showSuccessMessage = (string, dispatch) => {
  showNotification(string, 'success', dispatch)
}

const TransitionDown = (props) => {
  return <Slide {...props} direction="down" />
}

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (notification.message !== '') {
    return (
      <Snackbar open={notification.message !== ''} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
        <Alert severity={notification.type}>
          {notification.message}
        </Alert>
      </Snackbar>
    )
  }
  return null
}

export default Notification