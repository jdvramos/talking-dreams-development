import { resetState as resetAuthState } from "./authSlice";
import { resetState as resetMessengerState } from "./messengerSlice";

export const resetAllState = () => (dispatch) => {
    dispatch(resetAuthState());
    dispatch(resetMessengerState());
};