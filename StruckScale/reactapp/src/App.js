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
    const token = JSON.parse(localStorage.getItem("token"));
    let header;
    if (token) {
        header = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${(token.accessToken).replace(/"/g, '')}`
        }
    }
    const axiosInstance = axios.create({
        baseURL: url + ':7007/api/', // Adjust the base URL
        headers: header,
    })
    axios.interceptors.request.use((config) => {
        const token = JSON.parse(localStorage.getItem("token"));
        // Do something before request is sent
        if (token) {
            config.headers.Authorization = `Bearer ${token.accessToken.replace(/"/g, '')}`;
        }
        return config;
    }, (error) => {
        // Do something with request error
        console.log("..Sau khi request lỗi");
        return Promise.reject(error);
    });

    // Add a response interceptor
    let isRefreshing = false;
    let failedQueue = [];
    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };
    axios.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        const { config, response: { status, data } } = error;
        const originalRequest = config;
        if (status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                const token = JSON.parse(localStorage.getItem("token"));
                const refreshToken = token.refreshToken;
                axios.post(url + ':7007/api/Login/refresh-token', { RefreshToken: refreshToken })
                    .then((response) => {
                        isRefreshing = false;
                        localStorage.setItem("token", JSON.stringify(response.data));
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken
                        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.accessToken;
                        processQueue(null, response.data.accessToken);
                    })
                    .catch((err) => {
                        processQueue(err, null);
                    })
            }
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
                if (data === "Token Expired") {
                    Logout();
                }
            }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return axios(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }
        return Promise.reject(error);
    });
    let username = localStorage.getItem("userName");
    useEffect(() => {
        if (!username) {
            navigate("/");
            setHideNavbar(true);
        }
    }, [username]);
    const Logout = async () => {
        try {
            await axiosInstance.post("Login/revoke?username=" + username, {}, {
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
                    window.location.href = '/'
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
                            <button type="button" id="logOUt" className="btn btn-outline-secondary" onClick={() => Logout()}>Đăng xuất</button>
                        </div>
                    </nav>
                    <div className="row">
                        <div className="col-md-2 col-sm-2 w-12">
                            <NavBar />
                        </div>
                        <div className="col-md-10 col-sm-10 w-88">
                            <Routes>
                                <Route exac path="/Home" element={<Home />} />
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