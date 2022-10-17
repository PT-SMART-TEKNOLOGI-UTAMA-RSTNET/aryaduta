import {toast} from "react-toastify";
import parser from 'html-react-parser';
export const showSuccess = (message) => {
    //message = message.replaceAll("\n",'<br/>');
    toast.success(message, {
        position : toast.POSITION.TOP_RIGHT
    });
};
export const showError = (message) => {
    //message = message.replaceAll("\n",'<br/>');
    toast.error(message, {
        position : toast.POSITION.TOP_RIGHT
    });
};
