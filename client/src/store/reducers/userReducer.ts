import { createSlice } from "@reduxjs/toolkit";
import User from "../../models/user";

const initialState: {currentUser: User | null, loggedIn: boolean} = {
    currentUser: null ,
    loggedIn: false
}

const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action) {
            state.currentUser = action.payload;
            state.loggedIn = true;
        },
        logout(state) {
            return initialState;
        }
    }
})

export const {login, logout} = user.actions;
export default user.reducer;
