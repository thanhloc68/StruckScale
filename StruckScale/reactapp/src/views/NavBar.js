/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeLink: null,
        };
    }

    render() {
        const { activeLink } = this.state;
        let token = JSON.parse(localStorage.getItem("token"));
        return (
            <>
                <ul className="nav flex-column bg-gradient-primary">
                    <li className={`nav-item ${activeLink === "/home" ? "active" : ""}`}>
                        <NavLink to={"/home"} className="nav-link">Home</NavLink>
                    </li>
                    <li className={`nav-item ${activeLink === "/scalestruck" ? "active" : ""}`}>
                        <NavLink to={"/scalestruck"} className="nav-link">Cân xe</NavLink>
                    </li>
                    <li className={`nav-item ${activeLink === "/tankpump" ? "active" : ""}`}>
                        <NavLink to={"/tankpump"} className="nav-link">Bơm xe Bồn</NavLink >
                    </li>
                    <li className={`nav-item ${activeLink === "/report" ? "active" : ""}`}>
                        <NavLink to={"/report"} className="nav-link">Report</NavLink>
                    </li>
                    {token ?
                        token.roles === 1 ?
                            <li className={`nav-item ${activeLink === "/accounts" ? "active" : ""}`}>
                                <NavLink to={"/accounts"} className="nav-link">Account</NavLink>
                            </li> : ""
                        : ""
                    }
                </ul>
            </>
        )
    }
}
export default NavBar;