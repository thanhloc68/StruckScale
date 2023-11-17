/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import url from '../components/url';
import background from '../assets/img/background.png';
const Login = () => {
    const navigate = useNavigate();
    const [LoadingApi, setLoadingApi] = useState(false);
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            navigate("/home")
        }
    })
    const loginApi = async (username, password) => {
        try {
            const res = await axios.get(url + `:7007/api/login?username=${username}&password=${password}`)
            if (res.status == "200") {
                toast.success("Đăng nhập thành công")
                axios.defaults.headers.common['Authorization'] = `Bearer ${res['token']}`;
                localStorage.setItem('token', JSON.stringify(res.data))
                localStorage.setItem('userName', username)
                navigate('/home')
            }
        } catch (e) {
            if (e.response) {
                toast.error(e.response.data)
            }
        }
    }
    const [userName, SetUserName] = useState("");
    const [passWord, SetPassword] = useState("");
    const handleLogin = async () => {
        setLoadingApi(true);
        if (!userName || !passWord) {
            toast.error("Không hợp lệ")
            return;
        }
        try {
            await loginApi(userName, passWord)
        } catch (e) {
            if (e.response) {
                toast.error(e.response.data);
            }
        }
        setLoadingApi(false);
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }
    return (
        <>
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src={background} className="img-fluid" alt="Sample image" />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <form>
                                <div className="d-flex flex-row align-items-center justify-content-center">
                                    <p className="lead fw-normal mb-0 me-3 fw-bold mx-3 mb-0 pb-4">LOG IN TO YOUR ACCOUNT</p>
                                </div>
                                <label className="form-label">Tài Khoản</label>
                                <div className="input-group mb-4">
                                    <div className="input-group-text"><FontAwesomeIcon icon={faUser} /></div>
                                    <input type="text" onChange={(e) => SetUserName(e.target.value)} className="form-control form-control-lg" placeholder="Enter a valid user name" onKeyUp={(e) => handleKeyPress(e)} />
                                </div>
                                <label className="form-label">Mật Khẩu</label>
                                <div className="input-group mb-3">
                                    <div className="input-group-text"><FontAwesomeIcon icon={faLock} /></div>
                                    <input type="password" onChange={(e) => SetPassword(e.target.value)} className="form-control form-control-lg" placeholder="Enter password" onKeyUp={(e) => handleKeyPress(e)} />
                                </div>
                                <div className="text-center text-lg-start mt-4 pt-2 d-flex justify-content-center">
                                    <button type="button" className="btn btn-primary btn-lg"
                                        style={{ width: "250px", paddingLeft: "2.5rem", paddingRight: "2.5rem" }} onClick={() => handleLogin()} disabled={userName && passWord ? false : true}>
                                        {LoadingApi && <FontAwesomeIcon icon={faSpinner} spin />}&nbsp; Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section >
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}
export default Login;