// @ts-nocheck File not migrated fully to TS

import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import SystemStatusIcon from 'components/status/SystemStatusIcon';
import * as BasicComponents from 'components/basic';
import { ClusterServiceStatus } from 'components/shared/cluster/types';

describe('(Component) SystemStatusIcon', () => {
    global.Stage = { Basic: BasicComponents };
    const { Icon } = Stage.Basic;

    const mountSystemStatusIcon = (systemStatus: ClusterServiceStatus) => {
        const mockStore = configureMockStore();
        const store = mockStore({
            manager: {
                clusterStatus: {
                    status: systemStatus
                }
            }
        });
        const wrapper = mount(
            <Provider store={store}>
                <SystemStatusIcon />
            </Provider>
        );
        return wrapper;
    };

    it('renders with available status', () => {
        const systemStatus = ClusterServiceStatus.OK;
        const wrapper = mountSystemStatusIcon(systemStatus);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(Icon).instance().props.color).toBe('green'); // Green icon
    });

    it('renders with unavailable status', () => {
        const systemStatus = ClusterServiceStatus.Fail;
        const wrapper = mountSystemStatusIcon(systemStatus);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(Icon).instance().props.color).toBe('red'); // Red icon
    });

    it('renders with no status', () => {
        const systemStatus = undefined;
        const wrapper = mountSystemStatusIcon(systemStatus);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(Icon).instance().props.color).toBe('grey'); // Grey icon
    });

    it('renders with degraded status', () => {
        const systemStatus = ClusterServiceStatus.Degraded;
        const wrapper = mountSystemStatusIcon(systemStatus);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(Icon).instance().props.color).toBe('yellow'); // Yellow icon
    });
});
