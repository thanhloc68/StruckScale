import React from 'react'

class NavBar extends React.Component {
    render() {
        return (
            <ul className="nav flex-column bg-gradient-primary">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" href="/scalestruck">Cân xe</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" href="/tankpump">Bơm xe Bồn</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/report">Report</a>
                </li>
            </ul>
        )
    }
}
export default NavBar;