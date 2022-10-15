import React from "react";
import ReactDOM from "react-dom";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {showError, showSuccess} from "../../../Components/Toaster";
import {firebaseLogin, login} from "../../../Services/AuthService";
import moment from "moment";
import {ui,auth,googleAuthProvider,facebookAuthProvider} from "../../../Components/FirebaseConfig";

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            token : JSON.parse(localStorage.getItem('_token')),
            form : {
                username : '', password : {type:'password',text:''}, disabled : false,
                messages : { error : '', success : '' }, google : false,
            },
            google_data : null,
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.popupGoogle = this.popupGoogle.bind(this);
        this.submitGoogleLogin = this.submitGoogleLogin.bind(this);
    }
    componentDidMount() {
        if (this.state.token !== null) {
            //console.log(moment(this.state.token.expired_date).isAfter(moment()));
            if (moment(this.state.token.expired_date).isAfter(moment())) {
                window.location.href = window.origin + '/dashboard';
            }
        }
    }
    async submitGoogleLogin(formData){
        let form = this.state.form;
        try {
            let response = await firebaseLogin(formData);
            if (response.data.params === null) {
                form.google = false; form.disabled = false;
                form.messages.error = response.data.message;
                showError(response.data.message);
            } else {
                form.disabled = false;
                showSuccess(response.data.message);
            }
        } catch (e) {
            if (e.response.status === 400) {
                let queryParams = `?lname=${this.state.google_data.profile.family_name}&fname=${this.state.google_data.profile.given_name}&locale=${this.state.google_data.profile.locale}&picture=${this.state.google_data.profile.picture}&gid=${this.state.google_data.profile.id}`;
                queryParams = JSON.stringify(this.state.google_data);
                queryParams = btoa(queryParams);
                window.location.href = window.origin + '/auth/register?q=' + queryParams;
            }
            form.google = false; form.disabled = false;
            form.messages.error = e.response.data.message;
            showError(e.response.data.message);
        }
        this.setState({form,google_data:null});
    }
    processGoogleLogin(){
        const formData = new FormData();
        formData.append('email', this.state.google_data.profile.email);
        formData.append('picture', this.state.google_data.profile.picture);
        this.submitGoogleLogin(formData);
    }
    popupGoogle(){
        let form = this.state.form;
        form.username = '', form.messages.success = '', form.messages.error = '', form.google = true, form.disabled = true;
        this.setState({form});
        auth.signInWithPopup(googleAuthProvider)
            .then((res) => {
                form.messages.success = 'Authorisasi google berhasil';
                form.username = res.additionalUserInfo.profile.email;
                this.setState({form,google_data:res.additionalUserInfo});
                this.processGoogleLogin();
                /*const formData = new FormData();
                formData.append('email', res.additionalUserInfo.profile.email);
                formData.append('picture', res.additionalUserInfo.profile.picture);
                this.submitGoogleLogin(formData, res.additionalUserInfo.profile.picture);*/
            }).catch((err)=>{
                form.messages.errors = err.message;
                form.google = false, form.disabled = false;
                console.log('catch', err);
                this.setState({form});
            });
    }

    async handleLogin(e) {
        e.preventDefault();
        let form = this.state.form;
        form.disabled = true; this.setState({form});
        try {
            const formData = new FormData();
            formData.append('username', this.state.form.username);
            formData.append('password', this.state.form.password);
            let response = await login(formData);
            if (response.data.params === null) {
                showError(response.data.message);
            } else {
                if (typeof response.data.params.token !== 'undefined') {
                    localStorage.setItem('_token', JSON.stringify(response.data.params.token));
                    if (typeof response.data.params.user !== 'undefined') {
                        localStorage.setItem('_user', JSON.stringify(response.data.params.user));
                        window.location.href = window.origin + '/dashboard';
                    } else {
                        showError('Unexpected error, please contact developer');
                    }
                } else {
                    showError('Unexpected error, please contact developer');
                }
                //console.log(response.data.params);
            }
        } catch (e) {
            showError(e.response.data.message);
        }
        form.disabled = false; this.setState({form});
    }
    render(){
        return (
            <>
                <ToastContainer pauseOnHover position="top-center"/>
                <div className="row h-100">
                    <div className="col-lg-5 col-12">
                        <div id="auth-left">
                            <div className="auth-logo">
                                <a href={window.origin}>
                                    <img src={window.origin + '/theme/mazer/assets/images/logo/logo.svg'} alt="Logo"/>
                                </a>
                            </div>
                            {this.state.form.google ?
                                <div className="card">
                                    <div className="card-body py-4 px-5">
                                        {this.state.form.disabled ?
                                            <img src={window.origin + '/theme/mazer/assets/images/svg-loaders/ball-triangle.svg'} className="me-4" style={{width: '3rem'}} alt="audio"/>
                                            :
                                            this.state.google_data === null ?
                                                <img src={window.origin + '/theme/mazer/assets/images/svg-loaders/ball-triangle.svg'} className="me-4" style={{width: '3rem'}} alt="audio"/>
                                                :
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar avatar-xl">
                                                        {this.state.google_data !== null &&
                                                            <img src={this.state.google_data.profile.picture} alt="Face 1"/>
                                                        }
                                                    </div>
                                                    <div className="ms-3 name">
                                                        <h5 className="font-bold">John Duck</h5>
                                                        <h6 className="text-muted mb-0">@johnducky</h6>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                                :
                                <>
                                    <h1 className="auth-title">Log in.</h1>
                                    <p className="auth-subtitle mb-5">
                                        Log in with your data that you entered during registration.
                                    </p>
                                    <form onSubmit={this.handleLogin}>
                                        <div className="form-group position-relative has-icon-left mb-4">
                                            <input onChange={(e)=>{
                                                let form = this.state.form; form.username = e.target.value; this.setState({form});
                                            }} disabled={this.state.form.disabled} value={this.state.form.username} type="text" className="form-control form-control-xl" placeholder="Username"/>
                                            <div className="form-control-icon">
                                                <i className="bi bi-person"/>
                                            </div>
                                        </div>
                                        <div className="form-group position-relative has-icon-left mb-4">
                                            <input onChange={(e)=>{
                                                let form = this.state.form; form.password.text = e.target.value; this.setState({form});
                                            }} disabled={this.state.form.disabled} value={this.state.form.password.text} type={this.state.form.password.type} className="form-control form-control-xl" placeholder="Password"/>
                                            <div className="form-control-icon">
                                                <i className="bi bi-shield-lock"/>
                                            </div>
                                        </div>
                                        <button disabled={this.state.form.disabled} type="submit" className="btn btn-primary btn-block btn-lg shadow-lg mt-5">Log in</button>
                                    </form>

                                    <div className="text-center mt-5 text-lg fs-4">
                                        {this.state.form.messages.error.length > 0 &&
                                            <p className="text-sm text-danger">{this.state.form.messages.error}</p>
                                        }
                                        <p className="text-sm">
                                            <a onClick={this.popupGoogle} href="#">login using google account</a>
                                        </p>
                                        <p className="text-gray-600">
                                            Don't have an account?&nbsp;
                                            <a href={window.origin + '/auth/register'} className="font-bold">Sign up</a>.
                                        </p>
                                        <p>
                                            <a className="font-bold" href={window.origin + '/auth/forgot-password'}>
                                                Forgot password?
                                            </a>.
                                        </p>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="col-lg-7 d-none d-lg-block">
                        <div id="auth-right">

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Login;

if (document.getElementById('auth')) {
    ReactDOM.render(<Login/>, document.getElementById('auth'));
}
