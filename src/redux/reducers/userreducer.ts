import { UserActionTypes } from "../actions/actiontypes";
import { IUserData, UserActions } from "../actions/useractions";

export interface UserState {
    [UserActionTypes.USER_DATA]: IUserData | null;
}
const initialState: UserState = {
    [UserActionTypes.USER_DATA]: { UserId: "", Token: "" }
};

const userReducer = (state: UserState = initialState, action: UserActions): UserState | null => {
    switch (action.type) {
        case UserActionTypes.USER_DATA:
            return { ...state, [UserActionTypes.USER_DATA]: action.payload.value };
        default:
            return state;
    }
};

export default userReducer;