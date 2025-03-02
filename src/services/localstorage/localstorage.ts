import { IUserData } from "../../redux/actions/useractions"

export const USER_DATA_LS_KEY = "USER_DATA_LS_KEY"


export function GetUserDataFromLocalStorage(): IUserData | null {
    let res = localStorage.getItem(USER_DATA_LS_KEY)
    if (res != null) {
        return JSON.parse(res)
    }
    return null;
}

export function SetUserDataInLocalStorage(userData: IUserData): void {
    localStorage.setItem(USER_DATA_LS_KEY, JSON.stringify(userData))
}

export function DeleteUserDataInLocalStorage(): void {
    localStorage.removeItem(USER_DATA_LS_KEY)
}