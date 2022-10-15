import Axios from 'axios';

export const crudUser = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/users"
    });
    return Promise.resolve(request);
};
export const crudUserLevel = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/users/levels"
    });
    return Promise.resolve(request);
};
export const crudUserPrivilege = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/users/privileges"
    });
    return Promise.resolve(request);
};
