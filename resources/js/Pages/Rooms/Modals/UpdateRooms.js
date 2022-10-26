import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import NumberFormat from "react-number-format";
import {showSuccess,showError} from "../../../Components/Toaster";
import {crudRoom} from "../../../Services/RoomServices";

class UpdateRooms extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            buttons : {submit:{text:'Simpan',disabled:false}},
            form:{lantai:1, nomor_kamar:1, kapasitas:1, harga:0,harga_minimal:0, deskripsi:"", name:"",id:""},
        }
        this.submitCreate = this.submitCreate.bind(this);
        this.handleCleared = this.handleCleared.bind(this);
    }

    componentWillReceiveProps(props) {
        if(props.open && props.data !== null){
            let form = this.state.form;
            form.name = props.data.label;
            form.lantai = props.data.meta.lantai;
            form.nomor_kamar = props.data.meta.nomor;
            form.kapasitas = props.data.meta.kapasitas;
            form.harga = props.data.meta.harga;
            form.harga_minimal = props.data.meta.harga_minimal;
            form.deskripsi = props.data.meta.deskripsi;
            form.id = props.data.value;
            this.setState({form});
        }
    }

    handleCleared(){
        let form = this.state.form;
        form.name = "";
        form.lantai = 1;
        form.nomor_kamar = 0;
        form.kapasitas = "";
        form.harga = 0;
        form.harga_minimal = 0;
        form.deskripsi = "";
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
            formData.append('_method','patch');
            formData.append('id', this.state.form.id);
            formData.append('name', this.state.form.name);
            formData.append('nomor_kamar', this.state.form.nomor_kamar);
            formData.append('lantai', this.state.form.lantai);
            formData.append('kapasitas', this.state.form.kapasitas);
            formData.append('harga', this.state.form.harga);
            formData.append('harga_minimal', this.state.form.harga_minimal);
            formData.append('deskripsi', this.state.form.deskripsi);

            let response = await crudRoom(this.props.token.string,formData);
            if(response.data.params == null){
                showError(response.data.message);
            }else{
                this.props.handleUpdate();
                this.handleCleared();
                showSuccess(response.data.message);
            }
        }catch(e) {
            showError(e.response.data.message,'update');
        }

        button.submit.disabled = false;
        this.setState({button});
    }

    render() {
        return(
            <>
                <Dialog
                    id="update" fullWidth maxWidth="lg"
                    open={this.props.open}
                    onClose={() => this.state.buttons.submit.disabled === true ? null : this.props.handleClose('update')}
                    scroll="body">
                    <form onSubmit={this.submitCreate}>
                        <DialogTitle>Form Ubah Room</DialogTitle>

                        <DialogContent>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Nama Kamar</label>
                                        <input value={this.state.form.name} type="text" className="form-control bg-white" onChange={(e)=>{
                                            let form = this.state.form;
                                            form.name = e.target.value;
                                            this.setState({form});
                                        }}></input>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Lantai</label>
                                        <NumberFormat id='lantai'
                                                      thousandSeparator={"."} decimalSeparator={","} decimalScale={2}
                                                      value={this.state.form.lantai} className="form-control text-right bg-white"
                                                      onChange={(e)=>{
                                                          let form = this.state.form;
                                                          let explodeValue = event.target.value.split(',');
                                                          let nextValue = explodeValue[0].replaceAll('.','');
                                                          if (explodeValue.length > 1){
                                                              nextValue += '.' + explodeValue[1].replaceAll('.','');
                                                          }
                                                          if (nextValue === "") {
                                                              nextValue = 0;
                                                          }
                                                          if (nextValue > 0) {
                                                              form.lantai = parseFloat(nextValue);
                                                          }
                                                          this.setState({form});
                                                      }} />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Nomor Kamar</label>
                                        <NumberFormat id='nomor_kamar'
                                                      thousandSeparator={"."} decimalSeparator={","} decimalScale={2}
                                                      value={this.state.form.nomor_kamar} className="form-control text-right bg-white"
                                                      onChange={(e)=>{
                                                          let form = this.state.form;
                                                          let explodeValue = event.target.value.split(',');
                                                          let nextValue = explodeValue[0].replaceAll('.','');
                                                          if (explodeValue.length > 1){
                                                              nextValue += '.' + explodeValue[1].replaceAll('.','');
                                                          }
                                                          if (nextValue === "") {
                                                              nextValue = 0;
                                                          }
                                                          if (nextValue > 0) {
                                                              form.nomor_kamar = parseFloat(nextValue);
                                                          }
                                                          this.setState({form});
                                                      }} />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Kapasitas</label>
                                        <NumberFormat id='kapasitas'
                                                      thousandSeparator={"."} decimalSeparator={","} decimalScale={2}
                                                      value={this.state.form.kapasitas} className="form-control text-right bg-white"
                                                      onChange={(e)=>{
                                                          let form = this.state.form;
                                                          let explodeValue = event.target.value.split(',');
                                                          let nextValue = explodeValue[0].replaceAll('.','');
                                                          if (explodeValue.length > 1){
                                                              nextValue += '.' + explodeValue[1].replaceAll('.','');
                                                          }
                                                          if (nextValue === "") {
                                                              nextValue = 0;
                                                          }
                                                          if (nextValue > 0) {
                                                              form.kapasitas = parseFloat(nextValue);
                                                          }
                                                          this.setState({form});
                                                      }} />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Harga</label>
                                        <NumberFormat id='harga'
                                                      thousandSeparator={"."} decimalSeparator={","} decimalScale={2}
                                                      value={this.state.form.harga} className="form-control text-right bg-white"
                                                      onChange={(e)=>{
                                                          let form = this.state.form;
                                                          let explodeValue = event.target.value.split(',');
                                                          let nextValue = explodeValue[0].replaceAll('.','');
                                                          if (explodeValue.length > 1){
                                                              nextValue += '.' + explodeValue[1].replaceAll('.','');
                                                          }
                                                          if (nextValue === "") {
                                                              nextValue = 0;
                                                          }
                                                          if (nextValue > 0) {
                                                              form.harga = parseFloat(nextValue);
                                                          }
                                                          this.setState({form});
                                                      }} />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Harga Minimal</label>
                                        <NumberFormat id='harga_minimal'
                                                      thousandSeparator={"."} decimalSeparator={","} decimalScale={2}
                                                      value={this.state.form.harga_minimal} className="form-control text-right bg-white"
                                                      onChange={(e)=>{
                                                          let form = this.state.form;
                                                          let explodeValue = event.target.value.split(',');
                                                          let nextValue = explodeValue[0].replaceAll('.','');
                                                          if (explodeValue.length > 1){
                                                              nextValue += '.' + explodeValue[1].replaceAll('.','');
                                                          }
                                                          if (nextValue === "") {
                                                              nextValue = 0;
                                                          }
                                                          if (nextValue > 0) {
                                                              form.harga_minimal = parseFloat(nextValue);
                                                          }
                                                          this.setState({form});
                                                      }} />
                                    </div>
                                </div>
                            </div>



                            <div className="form-group">
                                <label>Deskripsi</label>
                                <textarea style={{resize:'none'}} className="form-control bg-white" value={this.state.form.deskripsi} onChange={(e)=>{
                                    let form = this.state.form;
                                    form.deskripsi = e.target.value;
                                    this.setState({form});
                                }}></textarea>
                            </div>

                        </DialogContent>

                        <DialogActions>
                            <button type="submit" disabled={this.state.buttons.submit.disabled} className="btn btn-outline-primary btn-flat mr-1"><i className="fas fa-save" /> {this.state.buttons.submit.text}</button>
                            <button type="button" onClick={() => this.state.buttons.submit.disabled ? null : this.props.handleClose('update', null)} disabled={this.state.buttons.submit.disabled} className="btn btn-outline-secondary btn-flat"><i className="fas fa-close" /> Tutup</button>

                        </DialogActions>
                    </form>
                </Dialog>
            </>
        )
    }
}

export default UpdateRooms;
