import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth/authReducer"

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export default store
