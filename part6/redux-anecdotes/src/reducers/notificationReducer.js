import { createSlice } from '@reduxjs/toolkit'


const notificationSlice = createSlice({
  name: 'notification',
  initialState: ' ',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    hideNotification(){ 
      return null;
    }
  }
})

export const { setNotification, hideNotification } = notificationSlice.actions

export const showNotification = (text, timeout) => {
  return async dispatch => {
      dispatch(setNotification(text))
      setTimeout(() => {
         dispatch(hideNotification(''))
      }, timeout * 1000) 
  }
}
export default notificationSlice.reducer
