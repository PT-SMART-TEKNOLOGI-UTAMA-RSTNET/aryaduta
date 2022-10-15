import React from "react";
import {logout} from "../Components/Logout";

class Topbar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_user : JSON.parse(localStorage.getItem('_user'))
        }
    }
    componentDidMount() {
        if (this.state.current_user === null) {
            logout();
            window.location.href = window.origin;
        }
    }

    render() {
        return (
            <header className="mb-3">
                <nav className="navbar navbar-expand navbar-light navbar-top">
                    <div className="container-fluid">
                        <a href="#" className="burger-btn d-block">
                            <i className="bi bi-justify fs-3"/>
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mb-lg-0">
                                <li className="nav-item dropdown me-1">
                                    <a className="nav-link active dropdown-toggle text-gray-600" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className='bi bi-envelope bi-sub fs-4'/>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                        <li>
                                            <h6 className="dropdown-header">Mail</h6>
                                        </li>
                                        <li><a className="dropdown-item" href="#">No new mail</a></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown me-3">
                                    <a className="nav-link active dropdown-toggle text-gray-600" href="#" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                        <i className='bi bi-bell bi-sub fs-4'/>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="dropdownMenuButton">
                                        <li className="dropdown-header">
                                            <h6>Notifications</h6>
                                        </li>
                                        <li className="dropdown-item notification-item">
                                            <a className="d-flex align-items-center" href="#">
                                                <div className="notification-icon bg-primary">
                                                    <i className="bi bi-cart-check"/>
                                                </div>
                                                <div className="notification-text ms-4">
                                                    <p className="notification-title font-bold">Successfully check out</p>
                                                    <p className="notification-subtitle font-thin text-sm">Order ID #256</p>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="dropdown-item notification-item">
                                            <a className="d-flex align-items-center" href="#">
                                                <div className="notification-icon bg-success">
                                                    <i className="bi bi-file-earmark-check"/>
                                                </div>
                                                <div className="notification-text ms-4">
                                                    <p className="notification-title font-bold">Homework submitted</p>
                                                    <p className="notification-subtitle font-thin text-sm">Algebra math homework</p>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <p className="text-center py-2 mb-0"><a href="#">See all notification</a></p>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <div className="dropdown">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="user-menu d-flex">
                                        <div className="user-name text-end me-3">
                                            <h6 className="mb-0 text-gray-600">{this.state.current_user.label}</h6>
                                            <p className="mb-0 text-sm text-gray-600">{this.state.current_user.meta.level.label}</p>
                                        </div>
                                        <div className="user-img d-flex align-items-center">
                                            <div className="avatar avatar-md">
                                                <img src={window.origin + '/theme/mazer/assets/images/faces/1.jpg'}/>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton" style={{minWidth:'11rem'}}>
                                    <li>
                                        <h6 className="dropdown-header">Hello, {this.state.current_user.label}!</h6>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href={window.origin + '/auth/profile'}>
                                            <i className="icon-mid bi bi-person me-2"/> My Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href={window.origin + '/auth/settings'}>
                                            <i className="icon-mid bi bi-gear me-2"/> Settings
                                        </a>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li>
                                        <a onClick={()=>logout()} className="dropdown-item" href="#"><i className="icon-mid bi bi-box-arrow-left me-2"/> Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Topbar;
