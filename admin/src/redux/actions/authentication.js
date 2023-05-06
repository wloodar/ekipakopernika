import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../setAuthToken';
import { socket, appStart } from '../../socket';

export const registerUser = (user, history) => dispatch => {
    axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/users/create`, user).then(res => {
        console.log(res);
        
        if (res.data['status'] !== undefined && res.data['status'] === 1) {
            dispatch({ type: GET_ERRORS, payload:{} });
        } else {
            dispatch({ type: GET_ERRORS, payload: res.data });
        }
    });
};

export const loginUser = (user) => dispatch => {
    axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/auth/login`, user).then(res => {
                if(res.data['status'] === undefined || res.data['status'] !== 1) {
                    dispatch({ type: GET_ERRORS, payload: res.data });
                } else {                    
                    const { token } = res.data;
                    localStorage.setItem('jwtToken', token);
                    setAuthToken(token);
                    const decoded = jwt_decode(token);
                    socket.emit("ADMIN_ACTIVE", {adminuuid: decoded.uuid});
                    dispatch(setCurrentUser(decoded, {}));
                }
            })
};

export const changeUserInfo = (data) => dispatch => {
    const token = data;
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    dispatch(setCurrentUser(decoded, {}));
}

export const setCurrentUser = (decoded, sock) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const logoutUser = (history) => dispatch => {
    const decoded = jwt_decode(localStorage.getItem('jwtToken'));
    const currentDate = new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z','');
    const duration = Date.parse(currentDate) - Date.parse(appStart);
    socket.emit("ADMIN_LEAVE", { uuid: decoded.uuid, duration: duration, start: appStart, finish: currentDate });
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
}

