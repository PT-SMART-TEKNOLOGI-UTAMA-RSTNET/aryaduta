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
import {checkAuth} from "../../Components/AuthCheck";
import Swal from "sweetalert2";
import Axios from 'axios';
import {loadRoom} from "../../Services/RoomServices";

$.fn.dataTable.Buttons.defaults.dom.button.className = 'btn';
$.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
    return false;
};

import CreateRooms from "./Modals/CreateRooms";
import UpdateRooms from "./Modals/UpdateRooms";
import User from "./Stats/User";
import Guest from "../Dashboard/Stats/Guest";

class Rooms extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_user : JSON.parse(localStorage.getItem('_user')),
            token : JSON.parse(localStorage.getItem('_token')),
            rooms : [],
            modals : {
                create:{open:false, data:null},
                update:{open:false, data:null}
            },
        };
        this.loadRooms = this.loadRooms.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    componentDidMount() {
        checkAuth();
        this.loadRooms();
    }
    toggleModal(what, data = null) {
        let modals = this.state.modals;
        modals[what].open = !this.state.modals[what].open;
        if (data !== null) modals[what].data = data;
        this.setState({ modals });
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
            title: "Perhatian !", html: `Anda yakin ingin Hapus Room ?`, icon: "question", showCancelButton: true, confirmButtonColor: "#FF9800",
            confirmButtonText: "Hapus", cancelButtonText: "Batalkan", cancelButtonColor: '#ddd', closeOnConfirm : false,
            showLoaderOnConfirm: true, allowOutsideClick: () => ! Swal.isLoading(), allowEscapeKey : () => ! Swal.isLoading(),
            preConfirm : (e)=> {
                return Promise.resolve(Axios({headers : { "Accept" : "application/json", "Authorization" : "Bearer " + checkAuth() }, method : 'post', data : formData, url : window.origin + '/api/rooms/crud'}))
                    .then((response) => {
                        if (response.data.params === null){
                            Swal.showValidationMessage(response.data.message, true);
                            Swal.hideLoading();
                        } else {
                            this.loadRooms();
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
    async loadRooms(){
        this.setState({rooms:[]});
        try {
            let response = await loadRoom(checkAuth(),null);
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.setState({rooms:response.data.params});
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
                    action : (d, dt, node, config) => { this.toggleModal('create',null) }
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
                    render : (data, type, row) => { return row.meta.nomor }
                },
                {
                    targets : 3, orderable : true,
                    render : (data, type, row) => { return row.meta.lantai }
                },
                {
                    createdCell:(td,cellData,rowData,row,col) => {
                        ReactDOM.render(
                            <div className="btn-group btn-group-sm">
                                <div className="dropdown">
                                    <button className="btn btn-sm btn-primary me-1" type="button" id={`dropdownMenuButton-${rowData.value}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-grip-lines"/>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${rowData.value}`}>
                                        <a onClick={()=>this.toggleModal('update',rowData)} className="dropdown-item" href="#"><i className="fa fa-edit"/> Edit</a>
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

    render() {
        return (
            <>
                <UpdateRooms open={this.state.modals.update.open} handleUpdate={this.loadRooms} handleClose={this.toggleModal} token={this.state.token} data={this.state.modals.update.data}/>
                <CreateRooms open={this.state.modals.create.open} handleClose={this.toggleModal} handleUpdate={this.loadRooms} token={this.state.token}/>
                <Sidebar route={this.props.route}/>
                <div id="main" className='layout-navbar'>
                    <Topbar/>
                    <div id="main-content">
                        <div className="page-heading">
                            <section className="section">
                                <div className="row">
                                    {this.state.current_user.meta.type === 'user' ? <User jmlKamar={this.state.rooms}/> : <Guest jmlKamar={this.state.rooms}/>}
                                </div>
                                <div className="card">
                                    <table id="dataTable" className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th className="align-middle text-center" width="20px">
                                                <input onClick={(e)=>{
                                                    $('#dataTable tbody input:checkbox').prop({checked:e.target.checked});
                                                }} type="checkbox"/>
                                            </th>
                                            <th className="align-middle">Nama</th>
                                            <th className="align-middle">Nomor</th>
                                            <th className="align-middle">Lantai</th>
                                            <th className="align-middle" width="70px">Aksi</th>
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

export default Rooms;

if (document.getElementById('app')){
    ReactDOM.render(<Rooms route="rooms"/>, document.getElementById('app'));
}
