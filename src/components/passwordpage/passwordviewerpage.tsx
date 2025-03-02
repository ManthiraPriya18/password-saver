import { useState } from 'react';
import { AppButton } from '../common/appbutton/appbutton'
import styles from './passwordviewerpage.module.css'
import { GetPasswordFromSupabase, SavePassword } from '../../services/supabase/supabase';
import { ISavePassword } from '../common/interface/interfaces';
import { EncryptData, GenerateSalt } from '../../services/encryption/encryption';
import { useAppSelector } from '../../redux/reduxhooks';
import { RootState } from '../../redux/store';
export const PasswordViewerPage = () => {

    const [userName, setUserName] = useState<string>("mandra1862@gmail.com");
    const [password, setPassword] = useState<string>("abcd");
    const [desc, setDesc] = useState<string>("Some desc");
    const userDataFromRedux = useAppSelector((state: RootState) => {
        return state.userData?.USER_DATA
    });

    function savePasswordClicked() {
        console.log(userName, password, desc)

        if (userDataFromRedux?.UserId == null || userDataFromRedux?.UserId == "") {
            //TODO: Manthira - Shpow ssome error
            return;
        }

        let randomChars = GenerateSalt(15);
        let encryptedSalt = EncryptData(randomChars, userDataFromRedux?.UserId)
        let encryptedPassword = EncryptData(password, randomChars)
        let data: ISavePassword = {
            UserName: userName,
            Password: encryptedPassword,
            Desc: desc,
            Salt: encryptedSalt,
            CreatedAt: new Date(),
            ModifiedAt: new Date()
        }
        SavePassword(data)
    }

    return (<div>
        <input placeholder="User name" value={userName} onChange={(e) => {
            setUserName(e.target.value)
        }}></input>
        <input placeholder="Password" value={password} onChange={(e) => {
            setPassword(e.target.value)
        }}></input>
        <input placeholder="Desciption" value={desc} onChange={(e) => {
            setDesc(e.target.value)
        }}></input>
        <div className={styles.btnOuter}>
            <AppButton label="Save Password" onClick={savePasswordClicked}></AppButton>
            <AppButton label="Get Data" onClick={GetPasswordFromSupabase}></AppButton>
        </div>
    </div>)
}