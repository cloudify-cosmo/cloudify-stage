import Cookies from 'js-cookie';
import { useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import Consts from '../utils/consts';
import { receiveLogin } from '../actions/managers';

const SamlLogin: FunctionComponent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const role = Cookies.get(Consts.ROLE_COOKIE_NAME);
        const username = Cookies.get(Consts.USERNAME_COOKIE_NAME);
        dispatch(receiveLogin(username, role));
    }, []);

    return null;
};

export default SamlLogin;
