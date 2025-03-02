import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { LoginPage } from './components/loginpage/loginpage'
import { PasswordViewerPage } from './components/passwordpage/passwordviewerpage'
import { Provider } from 'react-redux'
import store, { RootState } from './redux/store'
import { GetUserDataFromLocalStorage } from './services/localstorage/localstorage'
import { LogoutUser } from './services/supabase/supabase'
import { useAppDispatch, useAppSelector } from './redux/reduxhooks'

export let appconfig: AppConfig;
const loadConfig = async () => {
  if (appconfig == undefined) {
    const response = await fetch("/appconfig.json");
    appconfig = await response.json();
  }
  return appconfig;
};
const PrivateRoute = () => {

  const [authValidationStatus, setAuthValidationStatus] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const dispatch = useAppDispatch();

  // const userDataFromRedux = useAppSelector((state: RootState) => {
  //   return state.userData?.USER_DATA
  // });
  
  useEffect(() => {
    const checkIfUserAuthenticated = async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulating async delay
      let dataFromLocalStorage = GetUserDataFromLocalStorage();
      setAuthValidationStatus(true);
      if (dataFromLocalStorage == null) {
        // No user data available in local storage, Hence needs a login
        setIsAuthenticated(false)
        return;
      }
      console.log((Date.now() / 1000), dataFromLocalStorage.EpochTime)
      if (dataFromLocalStorage.EpochTime != null && (Date.now() / 1000) > dataFromLocalStorage.EpochTime) {
        LogoutUser(dispatch)
        setIsAuthenticated(false)
        return;
      }

      setIsAuthenticated(true)
    };

    checkIfUserAuthenticated();
  }, []);

  return (<div>
    {authValidationStatus == false ? <div> Loading...</div> :
      (isAuthenticated ? <Outlet /> : <Navigate to="/" />)}
  </div>)
};
loadConfig().then(() => {
  createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<PrivateRoute />} >
              <Route path="/view-passwords" element={<PasswordViewerPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>
    </Provider>
  );
}).catch((err) => {
  console.error("Error while loading config " + err)
});



interface AppConfig {
  SupaBaseConfig: SupaBaseConfig
}

interface SupaBaseConfig {
  ProjectUrl: string,
  AnonKey: string,
  RefreshTokenTriggerInMs: number
}