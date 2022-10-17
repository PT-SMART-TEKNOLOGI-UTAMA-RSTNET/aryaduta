import React from "react";
import Select from 'react-select';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import {showError, showSuccess} from "../../Components/Toaster";
import {crudUser} from "../../Services/UserService";
import {checkAuth} from "../../Components/AuthCheck";

class CUUser extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            form : {
                level : null, name : '', email : '', disabled : false, id : '',
                passwords : {
                    current : { type : 'password', text : '' },
                    repeat : { type : 'password', text : '' }
                }
            }
        };
        this.handleSave = this.handleSave.bind(this);
    }
    componentWillReceiveProps(props) {
        let form = this.state.form;
        if (props.data !== null) {
            form.id = props.data.value, form.name = props.data.label, form.email = props.data.meta.email,
                form.passwords.current.text = '', form.passwords.repeat.text = '';
            if (props.user_levels !== null) {
                let levelIndex = props.user_levels.findIndex((i) => i.value === props.data.meta.level.value);
                if (levelIndex >= 0) form.level = props.user_levels[levelIndex];
            }
        } else {
            form.id = '', form.level = null, form.name = '', form.email = '', form.email = '',
                form.passwords.current.text = '', form.passwords.repeat.text = '';
        }
        this.setState({form});
    }
    async handleSave(e) {
        e.preventDefault();
        let form = this.state.form;
        form.disabled = true; this.setState({form});
        try {
            const formData = new FormData();
            formData.append('_method', this.state.form.id.length === 0 ? 'put' : 'patch');
            formData.append('id', this.state.form.id);
            if (this.state.form.level !== null) formData.append('level', this.state.form.level.value);
            formData.append('name', this.state.form.name);
            formData.append('email', this.state.form.email);
            formData.append('password', this.state.form.passwords.current.text);
            formData.append('password_confirmation', this.state.form.passwords.repeat.text);
            let response = await crudUser(checkAuth(), formData);
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.props.handleUpdate(response.data.params[0]);
                this.props.handleClose(null);
                showSuccess(response.data.message);
            }
        } catch (e) {
            showError(e.response.data.message);
        }
        form.disabled = false; this.setState({form});
    }
    render() {
        return (
            <Dialog
                id="modal-create" fullWidth maxWidth="md"
                open={this.props.open}
                onClose={() => this.state.form.disabled ? null : this.props.handleClose(null)}
                scroll="body">
                <form onSubmit={this.handleSave}>
                    <DialogTitle>Form {this.state.form.id === null ? 'Tambah' : 'Ubah' } User</DialogTitle>
                    <DialogContent dividers={true}>
                        <div className="form-group row">
                            <label className="col-form-label col-md-3"><sup><i className="fa fa-asterisk text-danger text-xs"/></sup> Level</label>
                            <div className="col-md-9">
                                <Select onChange={(e)=>{
                                    let form = this.state.form; form.level = e; this.setState({form});
                                }} value={this.state.form.level} isDisabled={this.state.form.disabled} options={this.props.user_levels}/>
                            </div>
                        </div>
                        {this.state.form.level !== null &&
                            <div className="form-group row">
                                <label className="col-form-label col-md-3">Privileges</label>
                                <div className="col-md-9">
                                    <ul className="text-sm">
                                        {this.state.form.level.meta.privileges.map((item,index)=>
                                            <li key={index}>
                                                <b>{item.label}</b>
                                                <span style={{float:'right'}}>
                                                    { item.meta.privs.c ? <small className="text-success">Create</small> : <small className="text-danger">Create</small> },&nbsp;
                                                    { item.meta.privs.u ? <small className="text-success">Update</small> : <small className="text-danger">Update</small> },&nbsp;
                                                    { item.meta.privs.d ? <small className="text-success">Delete</small> : <small className="text-danger">Delete</small> }
                                                </span>
                                                <ul>
                                                    {item.meta.childrens.map((item1,index1)=>
                                                        <li key={index1} className="text-muted">
                                                            <b>{item1.label}</b>
                                                            <span style={{float:'right'}}>
                                                                { item1.meta.privs.c ? <small className="text-success">Create</small> : <small className="text-danger">Create</small> },&nbsp;
                                                                { item1.meta.privs.u ? <small className="text-success">Update</small> : <small className="text-danger">Update</small> },&nbsp;
                                                                { item1.meta.privs.d ? <small className="text-success">Delete</small> : <small className="text-danger">Delete</small> }
                                                            </span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        }
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label"><sup><i className="fa fa-asterisk text-danger text-xs"/></sup> Nama Lengkap</label>
                            <div className="col-md-9">
                                <input onChange={(e)=>{
                                    let form = this.state.form; form.name = e.target.value; this.setState({form});
                                }} value={this.state.form.name} className="form-control" disabled={this.state.form.disabled}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label"><sup><i className="fa fa-asterisk text-danger text-xs"/></sup> Email</label>
                            <div className="col-md-9">
                                <input onChange={(e)=>{
                                    let form = this.state.form; form.email = e.target.value; this.setState({form});
                                }} value={this.state.form.email} className="form-control" disabled={this.state.form.disabled}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label">Password</label>
                            <div className="col-md-9">
                                <input onChange={(e)=>{
                                    let form = this.state.form; form.passwords.current.text = e.target.value; this.setState({form});
                                }} type={this.state.form.passwords.current.type} value={this.state.form.passwords.current.text} className="form-control" disabled={this.state.form.disabled}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label">Konfirmasi Password</label>
                            <div className="col-md-9">
                                <input onChange={(e)=>{
                                    let form = this.state.form; form.passwords.repeat.text = e.target.value; this.setState({form});
                                }} type={this.state.form.passwords.repeat.type} value={this.state.form.passwords.repeat.text} className="form-control" disabled={this.state.form.disabled}/>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button type="submit" disabled={this.state.form.disabled} className="btn-sm btn btn-primary btn-flat mr-1"><i className="fa fa-save" /> {this.state.form.id === null ? this.state.disabled ? 'Menambahkan' : 'Tambah' : this.state.form.disabled ? 'Menyimpan' : 'Simpan'}</button>
                        <button type="button" onClick={() => this.state.form.disabled ? null : this.props.handleClose(null)} disabled={this.state.form.disabled} className="btn-sm btn btn-secondary btn-flat"><i className="fa fa-times"/> Tutup</button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

export default CUUser;
