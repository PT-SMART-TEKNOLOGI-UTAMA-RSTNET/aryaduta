import moment from 'moment';
import {logout} from "./Logout";

export const checkAuth = () => {
    let token = JSON.parse(localStorage.getItem('_token'));
    if (typeof token.expired_date !== 'undefined') {
        //console.log(moment(token.expired_date));
        //console.log(moment());
        //console.log(moment(token.expired_date).isAfter(moment()));
        if (moment(token.expired_date).isBefore(moment())) {
            //console.log(moment(token.expired_date), moment())
            logout();
        }
    }
    return token.string;
};
