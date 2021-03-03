import { useSelector } from 'react-redux';
import Internal from '../../utils/Internal';
import Manager from '../../utils/Manager';

export const useManager = () => {
    const manager = useSelector((state: any) => state.manager);
    return new Manager(manager);
};

export const useInternal = () => {
    const manager = useSelector((state: any) => state.manager);
    return new Internal(manager);
};
