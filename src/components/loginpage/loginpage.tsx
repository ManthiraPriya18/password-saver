import { useState } from "react"
import { AppButton } from "../common/appbutton/appbutton"
import styles from './loginpage.module.css'
import { LoginUser, LogoutUser } from "../../services/supabase/supabase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/reduxhooks";
export const LoginPage = () => {
    const [mailId, setMailId] = useState<string>("mandra1862@gmail.com");
    const [password, setPassword] = useState<string>("abcd");
    let dispatch = useAppDispatch();
    const navigate = useNavigate();
    async function loginClicked() {

        if (mailId === "" || password === "") {
            //TODO: Manthira - To check if valid input  & show respective message
            console.log('Invalid input')
            return;
        }
        console.log("login clicked", mailId, password)
        let isLoginSuccess = await LoginUser(mailId, password, dispatch);
        if (!isLoginSuccess) {
            //TODO: Manthira  - Show some message login failed
            console.log("Login Failed");
            return;
        }

        // Redirect to passwords page
        navigate("view-passwords")
    }
    async function logoutClicked(){
        LogoutUser(dispatch);
        navigate("")
    }
    function onMailIdChange(a: React.ChangeEvent<HTMLInputElement>) {
        setMailId(a.target.value)
    }
    function onPasswordChange(a: React.ChangeEvent<HTMLInputElement>) {
        setPassword(a.target.value)
    }
    return (<div>
        <input type="text" placeholder="User Mail Id" value={mailId} onChange={onMailIdChange} />
        <input type="password" placeholder="User Password" value={password} onChange={onPasswordChange} />
        <div className={styles.btnOuter}>
            <AppButton label="Login" onClick={loginClicked}></AppButton>
        </div>
        <div className={styles.btnOuter}>
            <AppButton label="Logout" onClick={logoutClicked}></AppButton>
        </div>
    </div>)
}