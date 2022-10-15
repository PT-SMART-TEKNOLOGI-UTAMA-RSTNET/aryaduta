import Axios from 'axios';

export const login = async (data) => {
    let request = Axios({
        headers : { "Accept" : "application/json" },
        method : "post", data : data, url : window.origin + "/api/auth/login"
    });
    return Promise.resolve(request);
};
export const firebaseLogin = async (data) => {
    let request = Axios({
        headers : { "Accept" : "application/json" },
        method : "post", data : data, url : window.origin + "/api/auth/firebase-login"
    });
    return Promise.resolve(request);
};
export const registerUser = async (data) => {
    let request = Axios({
        headers : { "Accept" : "application/json" },
        method : "post", data : data, url : window.origin + "/api/auth/register"
    });
    return Promise.resolve(request);
};
