import Axios from 'axios';

export const crudRoom = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/rooms"
    });
    return Promise.resolve(request);
};
