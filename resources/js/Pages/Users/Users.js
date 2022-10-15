import React from "react";
import ReactDOM from "react-dom";
import Sidebar from "../../Layouts/Sidebar";
import Footer from "../../Layouts/Footer";
import Topbar from "../../Layouts/Topbar";

import $ from "jquery";
import "datatables.net"
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-buttons";
import "datatables.net-buttons-bs4";

import {logout} from "../../Components/Logout";
import {showError} from "../../Components/Toaster";
import {crudUser, crudUserLevel} from "../../Services/UserService";
import {checkAuth} from "../../Components/AuthCheck";

class Users extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_user : JSON.parse(localStorage.getItem('_user')),
            token : JSON.parse(localStorage.getItem('_token')),
            users : [], user_levels : []
        };
        this.loadUsers = this.loadUsers.bind(this);
        this.loadUserLevels = this.loadUserLevels.bind(this);
    }
    componentDidMount() {
        checkAuth();
        this.loadUserLevels();
        this.loadUsers();
    }
    async loadUsers(){
        try {
            let response = await crudUser(checkAuth(),null);
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.setState({users:response.data.params});
            }
        } catch (e) {
            if (e.response.status === 401) logout();
            showError(e.response.data.message);
        }
    }
    async loadUserLevels(){
        try {
            let response = await crudUserLevel(checkAuth(),{});
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.setState({user_levels:response.data.params});
            }
        } catch (e) {
            if (e.response.status === 401) logout();
            showError(e.response.data.message);
        }
    }

    render() {
        return (
            <>
                <Sidebar route={this.props.route}/>
                <div id="main" className='layout-navbar'>
                    <Topbar/>
                    <div id="main-content">
                        <div className="page-heading">
                            <section className="section">
                                <div className="card">
                                    <div className="card-body">
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>
                                                <th className="align-middle text-center" width="20px">
                                                    <input type="checkbox"/>
                                                </th>
                                                <th className="align-middle text-center">Nama</th>
                                                <th className="align-middle text-center">Email</th>
                                                <th className="align-middle text-center">Level</th>
                                                <th className="align-middle text-center" width="100px">Aksi</th>
                                            </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <Footer/>
                    </div>
                </div>
            </>
        );
    }
}

export default Users;

if (document.getElementById('app')){
    ReactDOM.render(<Users route="users"/>, document.getElementById('app'));
}
