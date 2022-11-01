import Axios from 'axios';

export const loadRoom = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/rooms/crud"
    });
    return Promise.resolve(request);
};

export const crudRoom = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/rooms/crud"
    });
    return Promise.resolve(request);
};
