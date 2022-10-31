import Axios from 'axios';

export const loadProvinces = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/regions/provinces"
    });
    return Promise.resolve(request);
};

export const loadCity = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/regions/city"
    });
    return Promise.resolve(request);
};

export const loadDistrict = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/regions/district"
    });
    return Promise.resolve(request);
};

export const loadVillage = async (token,data) => {
    let request = Axios({
        headers : { "Accept" : "application/json", "Authorization" : `Bearer ${token}` },
        method : "post", data : data, url : window.origin + "/api/regions/village"
    });
    return Promise.resolve(request);
};
