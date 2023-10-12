/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import '../src/assets/style.css'
import { Route, Routes } from "react-router-dom"
import Home from './views/Home';
import Report from './views/Report';
import NavBar from './views/NavBar';
import ScaleStruck from './views/ScaleStruck';
import TankPump from './views/TankPump';

const App = () => {
    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
                    aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <a className="navbar-brand" href="#">TICO</a>
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    </ul>
                </div>
            </nav>
          <div className="row">
               <div className="col-md-1">
            <NavBar/>
           </div>
                <div className="col-md-11">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/scalestruck" element={<ScaleStruck />} />
                        <Route path="/tankpump" element={<TankPump />} />
                        <Route path="/report" element={<Report />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default App;