import React from "react";
import ReactDOM from "react-dom";
import Sidebar from "../../Layouts/Sidebar";
import Footer from "../../Layouts/Footer";
import Topbar from "../../Layouts/Topbar";
import {logout} from "../../Components/Logout";
import User from "./Stats/User";
import Guest from "./Stats/Guest";


class Dashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_user : JSON.parse(localStorage.getItem('_user')),
            token : JSON.parse(localStorage.getItem('_token')),
        };
    }
    componentDidMount() {
        if (this.state.token === null || this.state.current_user === null) {
            logout();
            window.location.href = window.origin;
        }
    }

    render() {
        return (
            <>
                <Sidebar route="dashboard"/>
                <div id="main" className='layout-navbar'>
                    <Topbar/>
                    <div id="main-content">
                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    {this.state.current_user.meta.type === 'user' ? <User/> : <Guest/>}
                                </div>
                            </div>
                        </div>

                        <Footer/>
                    </div>
                </div>
            </>
        );
    }
}

export default Dashboard;

if (document.getElementById('app')){
    ReactDOM.render(<Dashboard/>, document.getElementById('app'));
}
