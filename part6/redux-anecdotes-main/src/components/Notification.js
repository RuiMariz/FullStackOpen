import React from 'react'
import { connect } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'

const Notification = (props) => {
  const notification = props.notification
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    notification !== null ?
      <div style={style}>
        {notification}
      </div>
      : null
  )
}


const mapStateToProps = ({ notification }) => {
  return {
    notification
  }
}

const mapDispatchToProps = {
  createNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)