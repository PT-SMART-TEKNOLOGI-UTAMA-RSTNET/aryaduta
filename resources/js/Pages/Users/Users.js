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
import "datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css";

import {logout} from "../../Components/Logout";
import {showError} from "../../Components/Toaster";
import {crudUser, crudUserLevel} from "../../Services/UserService";
import {checkAuth} from "../../Components/AuthCheck";
import CUUser from "./CUUser";
import Swal from "sweetalert2";
import Axios from 'axios';

$.fn.dataTable.Buttons.defaults.dom.button.className = 'btn';
$.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
    return false;
};

class Users extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_user : JSON.parse(localStorage.getItem('_user')),
            token : JSON.parse(localStorage.getItem('_token')),
            users : [], user_levels : [],
            modals : { open : false, data : null },
        };
        this.loadUsers = this.loadUsers.bind(this);
        this.loadUserLevels = this.loadUserLevels.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    componentDidMount() {
        checkAuth();
        this.loadUserLevels();
        this.loadUsers();
    }
    toggleModal(data = null) {
        let modals = this.state.modals;
        modals.open = ! this.state.modals.open;
        modals.data = data;
        this.setState({modals});
    }
    confirmDelete(data = null) {
        const formData = new FormData();
        formData.append('_method', 'delete');
        if (data !== null) {
            formData.append('id[0]', data.value);
        } else {
            const checkboxes = $('#dataTable tbody input:checkbox:checked');
            checkboxes.map((index,item)=>{
                formData.append('id['+index+']', item.value);
            });
        }
        Swal.fire({
            title: "Perhatian !", html: `Anda yakin ingin Hapus user ?`, icon: "question", showCancelButton: true, confirmButtonColor: "#FF9800",
            confirmButtonText: "Hapus", cancelButtonText: "Batalkan", cancelButtonColor: '#ddd', closeOnConfirm : false,
            showLoaderOnConfirm: true, allowOutsideClick: () => ! Swal.isLoading(), allowEscapeKey : () => ! Swal.isLoading(),
            preConfirm : (e)=> {
                return Promise.resolve(Axios({headers : { "Accept" : "application/json", "Authorization" : "Bearer " + checkAuth() }, method : 'post', data : formData, url : window.origin + '/api/users'}))
                    .then((response) => {
                        if (response.data.params === null){
                            Swal.showValidationMessage(response.data.message, true);
                            Swal.hideLoading();
                        } else {
                            this.loadUsers();
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
    async loadUsers(){
        try {
            let response = await crudUser(checkAuth(),null);
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.setState({users:response.data.params});
                this.renderTable(response.data.params);
            }
        } catch (e) {
            if (e.response.status === 401) logout();
            showError(e.response.data.message);
        }
    }
    renderTable(dataSets){
        $('#dataTable').DataTable({
            dom : '<"card-header"<"row"<"col-md-6"B><"col-md-6"fr>>><"card-body"t><"card-footer"ip>',
            destroy : true, paging : true, ordering : true, processing : true,
            data : dataSets, order : [[1,'desc']],
            drawCallback:(a,b,c) => {
                //$('.dt-buttons').removeClass('btn-group');
            },
            buttons : [
                {
                    text : '<i class="fa fa-retweet"/>', className : 'btn btn-sm btn-success',
                    action : (e, dt, node, config) => { this.loadUsers() }
                },
                {
                    text: '<i class="fa fa-plus"/>', className: 'btn-sm btn-primary',
                    action : (d, dt, node, config) => { this.toggleModal(null) }
                },
                {
                    text: '<i class="fa fa-trash"/>', className: 'btn-sm btn-danger',
                    action : (d, dt, node, config) => { this.confirmDelete(null) }
                }
            ],
            columnDefs:[
                {
                    createdCell:(td,cellData,rowData,row,col) => {
                        ReactDOM.render(<input type="checkbox" value={rowData.value}/>, td);
                    }, targets : 0, orderable : false, className : 'text-center'
                },
                {
                    targets : 1, orderable : true,
                    render : (data, type, row) => { return row.label }
                },
                {
                    targets : 2, orderable : true,
                    render : (data, type, row) => { return row.meta.email }
                },
                {
                    targets : 3, orderable : true,
                    render : (data, type, row) => { return row.meta.level.label }
                },
                {
                    createdCell:(td,cellData,rowData,row,col) => {
                        ReactDOM.render(
                            <div className="btn-group btn-group-sm">
                                <div className="dropdown">
                                    <button className="btn btn-sm btn-primary dropdown-toggle me-1" type="button" id={`dropdownMenuButton-${rowData.value}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-grip-lines"/>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${rowData.value}`}>
                                        <a onClick={()=>this.toggleModal(rowData)} className="dropdown-item" href="#"><i className="fa fa-edit"/> Edit</a>
                                        <a onClick={()=>this.confirmDelete(rowData)} className="dropdown-item" href="#"><i className="fa fa-trash"/> Delete</a>
                                    </div>
                                </div>
                            </div>
                            , td);
                    }, targets : 4, orderable : false, className : 'text-center'
                }
            ]
        });
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
                <CUUser open={this.state.modals.open} data={this.state.modals.data} handleUpdate={this.loadUsers} handleClose={this.toggleModal} user_levels={this.state.user_levels}/>
                <Sidebar route={this.props.route}/>
                <div id="main" className='layout-navbar'>
                    <Topbar/>
                    <div id="main-content">
                        <div className="page-heading">
                            <section className="section">
                                <div className="card">
                                    <table id="dataTable" className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th className="align-middle text-center" width="20px">
                                                <input onClick={(e)=>{
                                                    $('#dataTable tbody input:checkbox').prop({checked:e.target.checked});
                                                }} type="checkbox"/>
                                            </th>
                                            <th className="align-middle text-center">Nama</th>
                                            <th className="align-middle text-center">Email</th>
                                            <th className="align-middle text-center">Level</th>
                                            <th className="align-middle text-center" width="70px">Aksi</th>
                                        </tr>
                                        </thead>
                                    </table>
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
