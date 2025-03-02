import { UserActionTypes } from "./actiontypes";

export interface IUserData {
    UserId: string,
    Token: string,
    EpochTime?: number
}

export interface UserDataAction {
    type: UserActionTypes.USER_DATA;
    payload: { value: IUserData | null };
}

export type UserActions = UserDataAction;
//If there are multiple actions, Refer below
// export type CounterActions = CounterValueAction | SomeOtherAction;

export function setUserData(value: IUserData): UserDataAction {
    return {
        type: UserActionTypes.USER_DATA,
        payload: { value },
    };
}

export function removeUserData(): UserDataAction {
    return {
        type: UserActionTypes.USER_DATA,
        payload: { value: null },
    };
}
