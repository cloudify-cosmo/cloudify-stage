import { useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { receiveLogin } from '../actions/managers';
import Auth from '../utils/auth';
import type { ReduxState } from '../reducers';

const SamlLogin: FunctionComponent = () => {
    const dispatch = useDispatch();
    const manager = useSelector((state: ReduxState) => state.manager);

    useEffect(() => {
        Auth.getUserData(manager).then(({ username, role }) => dispatch(receiveLogin(username, role)));
    }, []);

    return null;
};

export default SamlLogin;
