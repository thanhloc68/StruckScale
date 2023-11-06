/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import url from './url';
const axiosPrivate = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(function (config) {
            // Do something before request is sent
            console.log("..Sau khi request");
            return config;
        }, function (error) {
            // Do something with request error
            console.log("..Sau khi request lỗi");
            return Promise.reject(error);
        })
        // Add a response interceptor
        const responseIntercept = axios.interceptors.response.use(
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
        return () => {
            axios.interceptors.request.eject(requestIntercept)
            axios.interceptors.response.eject(responseIntercept)
        }
    }, [navigate])
}

export default axiosPrivate;