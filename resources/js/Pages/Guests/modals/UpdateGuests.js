import React from "react";
import {DialogActions,DialogTitle,Dialog,DialogContent} from "@mui/material";
import {showError,showSuccess} from "../../../Components/Toaster";
import NumberFormat from 'react-number-format';
import {loadProvinces,loadCity,loadDistrict,loadVillage} from "../../../Services/RegionServices";
import {crudGuests} from "../../../Services/GuestsServices";

export default class UpdateGuests extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            buttons : {submit:{disabled:false,text:"Simpan"}},
            form:{name:"",password:"",email:"", no_hp:"",alamat:"",id:""}
        }
        this.submitCreate = this.submitCreate.bind(this);
        this.handleCleared = this.handleCleared.bind(this);
    }

    componentWillReceiveProps(props) {
        if(props.open && props.data !== null){
            console.log(props.data);
            let form = this.state.form;
            form.id = props.data.value;
            form.name = props.data.label;
            form.email = props.data.meta.email;
            form.no_hp = props.data.meta.phone;
            form.alamat = props.data.meta.address;
            this.setState({form});
        }
    }

    handleCleared(){
        let form = this.state.form;
        form.id = "";
        form.name = "";
        form.password = "";
        form.email = "";
        form.no_hp = "";
        form.alamat = "";

        this.setState({form});

        this.props.handleClose('update');
    }

    async submitCreate(e){
        e.preventDefault();
        let button = this.state.buttons;
        button.submit.disabled = true;
        this.setState({button});
        try{
            let formData = new FormData();
            formData.append('_method', 'patch');
            formData.append('id',this.state.form.id);
            formData.append('name',this.state.form.name);
            formData.append('email', this.state.form.email);
            formData.append('password', this.state.form.password);
            formData.append('phone',this.state.form.no_hp);
            formData.append('alamat',this.state.form.alamat);
            let response = await crudGuests(this.props.token.string, formData);

            if(response.data.params == null){
                showError(response.data.message,'update');
            }else{
                this.props.handleUpdate();
                this.handleCleared();
                showSuccess(response.data.message);
            }
        }catch(e){
            showError(e.response.data.message,'update')
        }
        button.submit.disabled = false;
        this.setState({button});
    }

    render() {
        return(
            <Dialog
                id="update" fullWidth maxWidth="lg"
                open={this.props.open}
                onClose={() => this.state.buttons.submit.disabled === true ? null : this.handleCleared()}
                scroll="body">
                <form onSubmit={this.submitCreate}>
                    <DialogTitle>Form Ubah Tamu</DialogTitle>
                    <DialogContent>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div className="label">Nama</div>
                                    <input value={this.state.form.name} className="form-control bg-white" type="text" onChange={(e)=>{
                                        let form = this.state.form;
                                        form.name = e.target.value;
                                        this.setState({form});
                                    }}></input>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <div className="label">Email</div>
                                    <input value={this.state.form.email} className="form-control bg-white" type="email" onChange={(e)=>{
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
                                                  value={this.state.form.no_hp} className="form-control bg-white text-right"
                                                  onChange={(e)=>{
                                                      let form = this.state.form;
                                                      form.no_hp = e.target.value;
                                                      this.setState({form});
                                                  }} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Alamat</label>
                            <textarea className="form-control bg-white" onChange={(e)=>{
                                let form = this.state.form;
                                form.alamat = e.target.value;
                                this.setState({form});
                            }}>
                                {this.state.form.alamat}
                       </textarea>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button type="submit" disabled={this.state.buttons.submit.disabled} className="btn btn-outline-primary btn-flat mr-1"><i className="fas fa-save" /> {this.state.buttons.submit.text}</button>
                        <button type="button" onClick={() => this.state.buttons.submit.disabled ? null : this.handleCleared()} disabled={this.state.buttons.submit.disabled} className="btn btn-outline-secondary btn-flat"><i className="fas fa-xmark" /> Tutup</button>
                    </DialogActions>
                </form>
            </Dialog>
        )
    }
}


