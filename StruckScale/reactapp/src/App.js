/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import '../src/assets/style.css'
import { Route, Routes, useNavigate } from "react-router-dom"
import Report from './views/Report';
import ScaleStruck from './views/ScaleStruck';
import TankPump from './views/TankPump';
import Login from './views/Login';
import Home from './views/Home';
import NavBar from './views/NavBar';
import Accounts from './views/Accounts';
import url from './components/url';

const App = () => {
    const navigate = useNavigate();
    const [hideNabar, setHideNavbar] = useState(false);
    // Add a request interceptor

    let token = JSON.parse(localStorage.getItem("token"));
    if (token) {
        var header = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${(token.accessToken).replace(/"/g, '')}`
        }
    }
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        console.log("..Sau khi request");
        return config;
    }, function (error) {
        // Do something with request error
        console.log("..Sau khi request lỗi");
        return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(
        async function (response) {
            // Any status code that lies within the range of 2xx causes this function to trigger
            // Do something with the response data
            console.log("Successful response");
            return response;
        },
        async function (error) {
            // Any status codes that fall outside the range of 2xx cause this function to trigger
            console.log("Error response");
            const { config, response: { status, data } } = error;
            const originalRequest = config;
            if (status === 401) {
                console.log("Error response with status 401");
                const token = JSON.parse(localStorage.getItem("token"));
                const refreshToken = token.refreshToken;
                if (data === 'Token Expired') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userName");
                    navigate("/");
                }
                try {
                    const refreshResponse = await axios.post(url + ':7007/api/Login/refresh-token', { RefreshToken: refreshToken });
                    localStorage.setItem("token", JSON.stringify(refreshResponse.data));
                    originalRequest.headers['Authorization'] = 'Bearer ' + refreshResponse.data.accessToken;
                    // Retry the original request
                    return axios(originalRequest); // Return the modified originalRequest
                } catch (err) {
                    // Handle the error when refreshing the token
                    localStorage.removeItem("token");
                    localStorage.removeItem("userName");
                    navigate("/");
                    return Promise.reject(err);
                }
            }
            // For other error codes, reject the promise
            return Promise.reject(error);
        }
    );
    let username = localStorage.getItem("userName");
    useEffect(() => {
        if (!token) {
            navigate("/")
        }
        if (window.location.pathname === '/') {
            setHideNavbar(true);
        }
    }, [])
    const Logout = async () => {
        try {
            await axios.post(url + ":7007/api/Login/revoke?username=" + username, {}, {
                headers: header
            }).then(res => {
                localStorage.removeItem("token")
                localStorage.removeItem("userName")
                navigate("/")
            })
        } catch (e) {
            if (e.response) {
                if (e.response.status == '401') {
                    localStorage.removeItem("token")
                    localStorage.removeItem("userName")
                    navigate("/")
                }
            }
        }
    }
    return (
        <>
            <Routes>
                <Route path="/" exac element={<Login />} />
            </Routes>
            {(!hideNabar || window.location.pathname != "/") &&
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
                            aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <a className="navbar-brand" href="/home">TICO</a>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            </ul>
                        </div>
                        <div>
                            <span>Xin Chào : {username} </span>
                            <button type="button" className="btn btn-outline-secondary" onClick={(e) => Logout(e)}>Đăng xuất</button>
                        </div>
                    </nav>
                    <div className="row">
                        <div className="col-md-1 w--10">
                            <NavBar />
                        </div>
                        <div className="col-md-11 w--90">
                            <Routes>
                                <Route exac path="/" element={<Home />} />
                                <Route exac path="/scalestruck" element={<ScaleStruck />} />
                                <Route exac path="/tankpump" element={<TankPump />} />
                                <Route exac path="/report" element={<Report />} />
                                <Route exac path="/accounts" element={<Accounts />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
export default App;