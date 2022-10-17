import React from "react";
import ReactDOM from "react-dom";
import Sidebar from "../../../Layouts/Sidebar";
import Footer from "../../../Layouts/Footer";
import Topbar from "../../../Layouts/Topbar";
import Switch from '@mui/material/Switch';

import Select from 'react-select';

import {logout} from "../../../Components/Logout";
import {showError, showSuccess} from "../../../Components/Toaster";
import {crudUserLevel, crudUserPrivilege} from "../../../Services/UserService";
import {checkAuth} from "../../../Components/AuthCheck";
import Swal from "sweetalert2";
import Axios from 'axios';
import CULevel from "./CULevel";


class Levels extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_user : JSON.parse(localStorage.getItem('_user')),
            token : JSON.parse(localStorage.getItem('_token')),
            user_levels : [], current_level : null,
            modals : { open : false, data : null }, disabled : false,
        };
        this.loadUserLevels = this.loadUserLevels.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.togglePriv = this.togglePriv.bind(this);
        this.updatedLevel = this.updatedLevel.bind(this);
    }
    componentDidMount() {
        checkAuth();
        this.loadUserLevels();
    }
    toggleModal(data = null) {
        let modals = this.state.modals;
        modals.open = ! this.state.modals.open;
        modals.data = data;
        this.setState({modals});
    }
    updatedLevel(data) {
        if (typeof data === 'boolean') {
            this.setState({current_level:null});
        } else {
            this.setState({current_level:data});
            this.loadUserLevels();
        }
    }
    async togglePriv(target, type, data) {
        //this.setState({disabled:true});
        try {
            const formData = new FormData();
            formData.append('_method', 'patch');
            if (this.state.current_level !== null) formData.append('level', this.state.current_level.value);
            formData.append('checked', target.checked ? 1 : 0);
            formData.append('type', type);
            formData.append('privilege', data.value);
            let response = await crudUserPrivilege(checkAuth(), formData);
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.loadUserLevels();
                //showSuccess(response.data.message);
            }
        } catch (e) {
            if (e.response.status === 401) logout();
            showError(e.response.data.message);
        }
        //this.setState({disabled:false});
    }
    confirmDelete(data = null) {
        const formData = new FormData();
        formData.append('_method', 'delete');
        formData.append('id', data.value);
        Swal.fire({
            title: "Perhatian !", html: `Anda yakin ingin Hapus Level Pengguna ?`, icon: "question", showCancelButton: true, confirmButtonColor: "#FF9800",
            confirmButtonText: "Hapus", cancelButtonText: "Batalkan", cancelButtonColor: '#ddd', closeOnConfirm : false,
            showLoaderOnConfirm: true, allowOutsideClick: () => ! Swal.isLoading(), allowEscapeKey : () => ! Swal.isLoading(),
            preConfirm : (e)=> {
                return Promise.resolve(Axios({headers : { "Accept" : "application/json", "Authorization" : "Bearer " + checkAuth() }, method : 'post', data : formData, url : window.origin + '/api/users/levels'}))
                    .then((response) => {
                        if (response.data.params === null){
                            Swal.showValidationMessage(response.data.message, true);
                            Swal.hideLoading();
                        } else {
                            this.setState({current_level:null});
                            this.loadUserLevels();
                            Swal.close();
                            showSuccess(response.data.message);
                        }
                    }).catch((error)=>{
                        if (error.response.status === 401) logout();
                        Swal.showValidationMessage(error.response.data.message,true);
                    });
            }
        });
    }
    async loadUserLevels(){
        try {
            let response = await crudUserLevel(checkAuth(),{});
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.setState({user_levels:response.data.params});
                if (this.state.current_level !== null) {
                    let levelIndex = response.data.params.findIndex((i) => i.value === this.state.current_level.value);
                    if (levelIndex >= 0) {
                        let current_level = response.data.params[levelIndex];
                        this.setState({current_level});
                    }
                }
            }
        } catch (e) {
            if (e.response.status === 401) logout();
            showError(e.response.data.message);
        }
    }

    render() {
        return (
            <>
                <CULevel open={this.state.modals.open} data={this.state.modals.data} handleUpdate={this.updatedLevel} handleClose={this.toggleModal}/>
                <Sidebar route={this.props.route}/>
                <div id="main" className='layout-navbar'>
                    <Topbar/>
                    <div id="main-content">
                        <div className="page-heading">
                            <section className="section">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Select isClearable={true} onChange={(e)=>this.setState({current_level:e})} options={this.state.user_levels} value={this.state.current_level} isDisabled={this.state.disabled} isLoading={this.state.disabled}/>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.current_level !== null &&
                                                    <>
                                                        <button style={{marginRight:'5px'}} onClick={()=>this.toggleModal(this.state.current_level)} className="btn btn-primary mr-1"><i className="fa fa-edit"/></button>
                                                        <button style={{marginRight:'5px'}} disabled={!this.state.current_level.meta.delete} onClick={()=>this.confirmDelete(this.state.current_level)} className="btn btn-danger mr-1"><i className="fa fa-trash-alt"/></button>
                                                    </>
                                                }
                                                <button onClick={()=>this.toggleModal(null)}  className="btn btn-success mr-1"><i className="fa fa-plus"/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>
                                                <th colSpan={2} className="align-middle">Menu</th>
                                                <th width="100" className="align-middle">Read</th>
                                                <th width="100" className="align-middle">Create</th>
                                                <th width="100" className="align-middle">Update</th>
                                                <th width="100" className="align-middle">Delete</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.current_level !== null &&
                                                this.state.current_level.meta.privileges.map((item,index)=>
                                                    <>
                                                        <tr>
                                                            <td colSpan={2} className=""><i style={{marginRight:'10px'}} className={item.meta.icon} /><b>{item.label}</b></td>
                                                            <td className=""><Switch disabled={this.state.disabled} onClick={(e)=>this.togglePriv(e.target, 'r', item)} checked={item.meta.privs.r} /></td>
                                                            <td className=""><Switch disabled={this.state.disabled} onClick={(e)=>this.togglePriv(e.target, 'c', item)} checked={item.meta.privs.c} /></td>
                                                            <td className=""><Switch disabled={this.state.disabled} onClick={(e)=>this.togglePriv(e.target, 'u', item)} checked={item.meta.privs.u} /></td>
                                                            <td className=""><Switch disabled={this.state.disabled} onClick={(e)=>this.togglePriv(e.target, 'd', item)} checked={item.meta.privs.d} /></td>
                                                        </tr>
                                                        {item.meta.childrens.map((child,indexChild)=>
                                                            <tr key={indexChild}>
                                                                <td width="20px"/>
                                                                <td><i style={{marginRight:'10px'}} className={child.meta.icon}/> {child.label}</td>
                                                                <td className=""><Switch disabled={!item.meta.privs.r} onClick={(e)=>this.togglePriv(e.target, 'r', child)} checked={child.meta.privs.r} /></td>
                                                                <td className=""><Switch disabled={!item.meta.privs.r} onClick={(e)=>this.togglePriv(e.target, 'c', child)} checked={child.meta.privs.c} /></td>
                                                                <td className=""><Switch disabled={!item.meta.privs.r} onClick={(e)=>this.togglePriv(e.target, 'u', child)} checked={child.meta.privs.u} /></td>
                                                                <td className=""><Switch disabled={!item.meta.privs.r} onClick={(e)=>this.togglePriv(e.target, 'd', child)} checked={child.meta.privs.d} /></td>
                                                            </tr>
                                                        )}
                                                    </>
                                                )
                                            }
                                            </tbody>
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

export default Levels;

if (document.getElementById('app')){
    ReactDOM.render(<Levels route="users.levels"/>, document.getElementById('app'));
}
