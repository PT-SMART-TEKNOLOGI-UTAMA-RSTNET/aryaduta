import React from "react";
import ReactDOM from 'react-dom';
import {showError, showSuccess} from "../../../Components/Toaster";
import {registerUser} from "../../../Services/AuthService";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            form : {
                disabled : false, name : '', email : '',
                passwords : {
                    current : { type : 'password', text : '' },
                    repeat : { type : 'password', text : '' }
                }
            },
            register : null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.togglePass = this.togglePass.bind(this);
    }
    componentDidMount() {
        let curUrl = new Proxy(new URLSearchParams(window.location.search), {
            get : (searchParams, prop) => searchParams.get(prop),
        });
        if (curUrl.q !== null) {
            if (curUrl.q.length > 100) {
                let response = atob(curUrl.q);
                response = JSON.parse(response);
                let form = this.state.form;
                form.name = response.profile.name, form.email = response.profile.email;
                this.setState({form});
            }
        }
    }
    togglePass(what){
        let form = this.state.form;
        form.passwords[what].type = this.state.form.passwords[what].type === 'password' ? 'text' : 'password';
        this.setState({form});
    }
    async handleSubmit(e) {
        e.preventDefault();
        let form = this.state.form;
        form.disabled = true; this.setState({form});
        try {
            const formData = new FormData();
            formData.append('name', this.state.form.name);
            formData.append('email', this.state.form.email);
            formData.append('password', this.state.form.passwords.current.text);
            formData.append('password_confirmation', this.state.form.passwords.repeat.text);
            let response = await registerUser(formData);
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                this.setState({register:response.data.params});
                showSuccess(response.data.message);
            }
        } catch (e) {
            showError(e.response.data.message);
        }
        form.disabled = false; this.setState({form});
    }
    render() {
        return (
            <div className="row h-100">
                <ToastContainer pauseOnHover position="top-center"/>
                <div className="col-lg-5 col-12">
                    <div id="auth-left">
                        <div className="auth-logo">
                            <a href={window.origin}><img src={window.origin + '/theme/mazer/assets/images/logo/logo.svg'} alt="Logo"/></a>
                        </div>
                        <h1 className="auth-title">Sign Up</h1>
                        {this.state.register === null ?
                            <>
                                <p className="auth-subtitle mb-5">Input your data to register to our website.</p>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group position-relative has-icon-left mb-4">
                                        <input onChange={(e)=>{
                                            let form = this.state.form; form.name = e.target.value; this.setState({form});
                                        }} disabled={this.state.form.disabled} value={this.state.form.name} type="text" className="form-control form-control-xl" placeholder="Full name"/>
                                        <div className="form-control-icon">
                                            <i className="bi bi-person"/>
                                        </div>
                                    </div>
                                    <div className="form-group position-relative has-icon-left mb-4">
                                        <input onChange={(e)=>{
                                            let form = this.state.form; form.email = e.target.value; this.setState({form});
                                        }} disabled={this.state.form.disabled} value={this.state.form.email} type="text" className="form-control form-control-xl" placeholder="Email"/>
                                        <div className="form-control-icon">
                                            <i className="bi bi-envelope"/>
                                        </div>
                                    </div>
                                    <div className="form-group position-relative has-icon-left mb-4">
                                        <input onChange={(e)=>{
                                            let form = this.state.form; form.passwords.current.text = e.target.value; this.setState({form});
                                        }} disabled={this.state.form.disabled} value={this.state.form.passwords.current.text} type={this.state.form.passwords.current.type} className="form-control form-control-xl" placeholder="Password"/>
                                        <div onClick={(e)=>this.togglePass('current')} className="form-control-icon">
                                            <i className="bi bi-shield-lock"/>
                                        </div>
                                    </div>
                                    <div className="form-group position-relative has-icon-left mb-4">
                                        <input onChange={(e)=>{
                                            let form = this.state.form; form.passwords.repeat.text = e.target.value; this.setState({form});
                                        }} disabled={this.state.form.disabled} value={this.state.form.passwords.repeat.text} type={this.state.form.passwords.repeat.type} className="form-control form-control-xl" placeholder="Confirm Password"/>
                                        <div onClick={()=>this.togglePass('repeat')} className="form-control-icon">
                                            <i className="bi bi-shield-lock"/>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-block btn-lg shadow-lg mt-5">Sign Up</button>
                                </form>
                            </>
                            :
                            <>
                                <div className="alert alert-info">
                                    <b>Thank you.</b>
                                    Registration successfull, please check your email for verification
                                </div>
                            </>
                        }


                        <div className="text-center mt-5 text-lg fs-4">
                            <p className='text-gray-600'>
                                Already have an account?
                                <a href={window.origin + '/auth/login'} className="font-bold">Log in</a>.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7 d-none d-lg-block">
                    <div id="auth-right">

                    </div>
                </div>
            </div>
        );
    }

}


export default Register;

if (document.getElementById('auth')) {
    ReactDOM.render(<Register/>, document.getElementById('auth'));
}
