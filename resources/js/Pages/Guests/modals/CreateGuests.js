import React from "react";
import {DialogActions,DialogTitle,Dialog,DialogContent} from "@mui/material";
import {showError,showSuccess} from "../../../Components/Toaster";
import NumberFormat from 'react-number-format';
import {loadProvinces,loadCity,loadDistrict,loadVillage} from "../../../Services/RegionServices";

export default class CreateGuests extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            buttons : {submit:{disabled:false,text:"Simpan"}},
            form:{name:"",password:"",email:"", no_hp:"",alamat:""}
        }
        this.submitCreate = this.submitCreate.bind(this);
    }

   async submitCreate(e){
        e.preventDefault();
        try{
            let formData = new FormData();
            formData.append('name',this.state.form.name);
            formData.append('email', this.state.form.email);
            formData.append('password', this.state.form.password);
            formData.append('alamat',this.state.form.alamat);

            let response = await
        }catch(e){
            showError(e.response.data.message,'create')
        }
    }

    render() {
        return(
            <Dialog
                id="create" fullWidth maxWidth="lg"
                open={this.props.open}
                onClose={() => this.state.buttons.submit.disabled === true ? null : this.props.handleClose('create',null)}
                scroll="body">
                <form onSubmit={this.submitCreate}>
                <DialogTitle>Form Tambah Tamu</DialogTitle>
                <DialogContent>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="label">Nama</div>
                                <input className="form-control" type="text" onChange={(e)=>{
                                    let form = this.state.form;
                                    form.name = e.target.value;
                                    this.setState({form});
                                }}></input>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="label">Email</div>
                                <input className="form-control" type="email" onChange={(e)=>{
                                    let form = this.state.form;
                                    form.email = e.target.value;
                                    this.setState({form});
                                }}></input>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="label">No HP</div>
                                <NumberFormat id='no_hp'
                                              value={this.state.form.jumlah} className="form-control text-right"
                                              onChange={(e)=>{
                                                  let form = this.state.form;
                                                  form.no_hp = e.target.value;
                                                  this.setState({form});
                                              }} />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="label">Password</div>
                                <input className="form-control" type="text" onChange={(e)=>{
                                    let form = this.state.form;
                                    form.password = e.target.value;
                                    this.setState({form});
                                }}></input>
                            </div>
                        </div>
                    </div>

                   <div className="form-group">
                       <label>Alamat</label>
                       <textarea className="form-control" onChange={(e)=>{
                           let form = this.state.form;
                           form.alamat = e.target.value;
                           this.setState({form});
                       }}>

                       </textarea>
                   </div>
                </DialogContent>
                <DialogActions>
                    <button type="submit" disabled={this.state.buttons.submit.disabled} className="btn btn-outline-primary btn-flat mr-1"><i className="fas fa-save" /> {this.state.buttons.submit.text}</button>
                    <button type="button" onClick={() => this.state.buttons.submit.disabled ? null : this.props.handleClose('create', null)} disabled={this.state.buttons.submit.disabled} className="btn btn-outline-secondary btn-flat"><i className="fas fa-xmark" /> Tutup</button>
                </DialogActions>
                </form>
            </Dialog>
        )
    }
}


