import { createContext, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'

const notificationReducer = (state, action) => {
    switch (action.type) {
      case "SHOWNOTIFICATION":
          return action.payload
      case "HIDENOTIFICATION":
          return ''
      default:
          return state
    }
}


const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, ' ')
  
    return (
      <NotificationContext.Provider value={[notification, notificationDispatch] }>
        {props.children}
      </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[0]
  }
  
export const useNotificationDispatch = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[1]
}
  
export default NotificationContext

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}