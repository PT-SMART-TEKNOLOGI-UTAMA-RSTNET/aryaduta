import Axios from 'axios';

export const crudGuests = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/guests/crud"
    });
    return Promise.resolve(request);
};
