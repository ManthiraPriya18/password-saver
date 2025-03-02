import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { appconfig } from "../../main";
import { AppDispatch } from "../../redux/store";
import { IUserData, removeUserData, setUserData } from "../../redux/actions/useractions";
import { DeleteUserDataInLocalStorage, SetUserDataInLocalStorage } from "../localstorage/localstorage";
let supabase: SupabaseClient | undefined;
let refreshInterval: any;
async function getSupabaseClient(): Promise<SupabaseClient> {
    await initializeSupabaseClient();
    if (supabase == undefined) {
        throw new Error('Supabase client not initialized');
    }
    return supabase;
}
async function initializeSupabaseClient(): Promise<void> {
    try {
        if (supabase != undefined) {
            return;
        }
        supabase = createClient(appconfig.SupaBaseConfig.ProjectUrl, appconfig.SupaBaseConfig.AnonKey);
    } catch (error) {
        console.error('Failed to initialize Supabase client', error);
    }
}
async function setupSessionRefresh(dispatch: AppDispatch) {
    // Clear any existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }

    refreshInterval = setInterval(() => {
        refreshSession(dispatch);
    }, appconfig.SupaBaseConfig.RefreshTokenTriggerInMs);
}

async function refreshSession(dispatch: AppDispatch): Promise<boolean> {
    try {
        let supabaseClient = await getSupabaseClient();
        if (supabaseClient == undefined) {
            console.error('Supabase client not initialized');
            return false;
        }
        const { data, error } = await supabaseClient!.auth.refreshSession();
        if (error) {
            console.error('Failed to refresh session', error);
            return false;
        }
        console.log(data)
        let userData: IUserData = {
            UserId: data.user?.id!,
            Token: data!.session!.access_token,
            EpochTime: data!.session!.expires_at
        }
        dispatch(setUserData(userData))
        SetUserDataInLocalStorage(userData)
        return true;
    } catch (error) {
        await LogoutUser(dispatch);
        console.error('Failed to refresh session', error);
        return false;
    }
}

export async function LogoutUser(dispatch: AppDispatch): Promise<boolean> {
    try {
        // For supabase
        let supabaseClient = await getSupabaseClient();
        if (supabaseClient == undefined) {
            console.error('Supabase client not initialized');
            return false;
        }
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Failed to logout user', error);
            return false;
        }
        // Clear the session refresh interval
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = undefined;
        }

        // For local storage
        DeleteUserDataInLocalStorage();

        // For App 
        dispatch(removeUserData())
        return true;
    } catch (error) {
        console.error('Failed to logout user', error);
        return false;
    }
}

export async function LoginUser(email: string, password: string, dispatch: AppDispatch): Promise<boolean> {
    try {
        let supabaseClient = await getSupabaseClient();
        if (supabaseClient == undefined) {
            console.error('Supabase client not initialized');
            return false;
        }
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) {
            console.error('Failed to login user', error);
            return false;
        }
        let userData: IUserData = {
            UserId: data.user.id,
            Token: data.session.access_token,
            EpochTime: data.session.expires_at
        }
        dispatch(setUserData(userData))
        SetUserDataInLocalStorage(userData)
        setupSessionRefresh(dispatch);
        return true;
    } catch (error) {
        console.error('Failed to login user', error);
        return false;
    }
}