import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { LoginPage } from './components/loginpage/loginpage'
import { PasswordViewerPage } from './components/passwordpage/passwordviewerpage'

const PrivateRoute = () => {

  const [authValidationStatus, setAuthValidationStatus] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  async function checkIfUserAutheticated() {
    await new Promise(resolve => setTimeout(resolve, 5000))
    let isUserAuthenticated = localStorage.getItem("authToken"); // Check if user is logged in
    isUserAuthenticated = "aa";
    setIsAuthenticated(isUserAuthenticated.length != 0)
    setAuthValidationStatus(true)
  }

  checkIfUserAutheticated();

  return (<div>
    {authValidationStatus == false ? <div> Loading...</div> :
     (isAuthenticated ? <Outlet /> : <Navigate to="/" />)}
  </div>)
};
createRoot(document.getElementById('root')!).render(
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
  </StrictMode>,
)


