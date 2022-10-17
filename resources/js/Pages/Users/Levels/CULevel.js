import React from "react";
import {showError, showSuccess} from "../../../Components/Toaster";
import {crudUserLevel} from "../../../Services/UserService";
import {checkAuth} from "../../../Components/AuthCheck";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

class CULevel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            form : {
                disabled : false, id : null, name : '', description : '', disabled_name : false
            }
        };
        this.handleSave = this.handleSave.bind(this);
    }
    componentWillReceiveProps(props) {
        let form = this.state.form;
        if (props.data  !== null) {
            form.id = props.data.value, form.name = props.data.label, form.description = props.data.meta.description;
            if (!props.data.meta.delete) {
                form.disabled_name = true;
            }
        } else {
            form.id = null, form.name = '', form.description = '', form.disabled_name = false;
        }
        this.setState({form});
    }
    async handleSave(e){
        e.preventDefault();
        let form = this.state.form;
        form.disabled = true; this.setState({form});
        try {
            const formData = new FormData();
            formData.append('_method', this.state.form.id === null ? 'put' : 'patch');
            formData.append('id', this.state.form.id);
            formData.append('name', this.state.form.name);
            formData.append('description', this.state.form.description);
            let response = await crudUserLevel(checkAuth(), formData);
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.props.handleUpdate(response.data.params);
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
                    <DialogTitle>Form {this.state.form.id === null ? 'Tambah' : 'Ubah' } User Level</DialogTitle>
                    <DialogContent dividers={true}>
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label"><sup><i className="fa fa-asterisk text-danger text-xs"/></sup> Nama</label>
                            <div className="col-md-9">
                                <input onChange={(e)=>{
                                    let form = this.state.form; form.name = e.target.value; this.setState({form});
                                }} value={this.state.form.name} className="form-control" disabled={this.state.form.disabled || this.state.form.disabled_name}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label">Deskripsi</label>
                            <div className="col-md-9">
                                <input onChange={(e)=>{
                                    let form = this.state.form; form.description = e.target.value; this.setState({form});
                                }} value={this.state.form.description} className="form-control" disabled={this.state.form.disabled}/>
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

export default CULevel;
