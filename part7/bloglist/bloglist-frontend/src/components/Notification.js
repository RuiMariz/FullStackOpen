import React from 'react'
import { useSelector } from 'react-redux'

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