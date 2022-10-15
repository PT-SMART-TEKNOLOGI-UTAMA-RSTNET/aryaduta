import React from "react";
import {logout} from "../Components/Logout";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";

class Sidebar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_user : JSON.parse(localStorage.getItem('_user')),
            menus : []
        };
    }
    componentDidMount() {
        if (this.state.current_user !== null) {
            let menus = this.state.current_user.meta.level.meta.menus;
            this.setState({menus});
        } else {
            logout();
        }
    }

    render() {
        return (
            <div id="sidebar" className="active">
                <ToastContainer pauseOnHover position="top-center"/>
                <div className="sidebar-wrapper active">
                    <div className="sidebar-header position-relative">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="logo">
                                <a href={window.origin}>
                                    <img src={window.origin + '/theme/mazer/assets/images/logo/logo.svg'} alt="Logo" srcSet=""/>
                                </a>
                            </div>
                            <div className="theme-toggle d-flex gap-2 align-items-center mt-2">
                                <i className="bi bi-sun fs-6 mb-2"/>
                                <div className="form-check form-switch fs-6">
                                    <input className="form-check-input  me-0" type="checkbox" id="toggle-dark"/>
                                    <label className="form-check-label"/>
                                </div>
                                <i className="mb-2 fs-6 bi bi-moon-fill"/>
                            </div>
                            <div className="sidebar-toggler  x">
                                <a href="#" className="sidebar-hide d-xl-none d-block"><i className="bi bi-x bi-middle"/></a>
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-menu">
                        <ul className="menu">
                            <li className={this.props.route === 'dashboard' ? 'sidebar-item active' : 'sidebar-item'}>
                                <a href={window.origin + '/dashboard'} className='sidebar-link'>
                                    <i className="bi bi-grid-fill"/>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            {this.state.menus.map((parent,index)=>
                                parent.meta.childrens.length === 0 ?
                                    <li key={index} className={this.props.route === parent.meta.route ? 'sidebar-item active' : 'sidebar-item'}>
                                        <a href={parent.meta.url} className='sidebar-link'>
                                            <i className={parent.meta.icon}/>
                                            <span>{parent.label}</span>
                                        </a>
                                    </li>
                                    :
                                    <li key={index} className={
                                        this.props.route === parent.meta.route ?
                                            'sidebar-item has-sub active'
                                            :
                                            parent.meta.childrens.findIndex((i) => i.meta.route === this.props.route) >= 0 ?
                                                'sidebar-item has-sub active' : 'sidebar-item has-sub'
                                    }>
                                        <a href={parent.meta.url} className='sidebar-link'>
                                            <i className={parent.meta.icon}/>
                                            <span>{parent.label}</span>
                                        </a>
                                        <ul style={{paddingLeft:0}} className={
                                            this.props.route === parent.meta.route ?
                                                'submenu active' :
                                                parent.meta.childrens.findIndex((i) => i.meta.route === this.props.route) >= 0 ?
                                                    'submenu active' : 'submenu'
                                        }>
                                            <li className={
                                                this.props.route === parent.meta.route ?
                                                    'submenu-item active' : 'submenu-item'
                                            }>
                                                <a href={parent.meta.url}>
                                                    <i className={parent.meta.icon}/>
                                                    <span style={{marginLeft:10}}>{parent.label}</span>
                                                </a>
                                            </li>
                                            {parent.meta.childrens.map((children,indexChild)=>
                                                <li key={indexChild} className={ this.props.route === children.meta.route ? 'submenu-item active' : 'submenu-item'}>
                                                    <a href={children.meta.url}>
                                                        <i className={children.meta.icon}/>
                                                        <span style={{marginLeft:10}}>{children.label}</span>
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                            )}



                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}


export default Sidebar;
