import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import type { IconProps } from 'semantic-ui-react';
import SystemStatusIcon from 'components/common/status/SystemStatusIcon';
import { ClusterServiceStatus } from 'components/common/status/cluster/types';

describe('(Component) SystemStatusIcon', () => {
    const { Icon } = Stage.Basic;

    const mountSystemStatusIcon = (systemStatus?: ClusterServiceStatus) => {
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
        const iconProps: IconProps = wrapper.find(Icon).instance().props;
        expect(iconProps.color).toBe('green'); // Green icon
    });

    it('renders with unavailable status', () => {
        const systemStatus = ClusterServiceStatus.Fail;
        const wrapper = mountSystemStatusIcon(systemStatus);
        expect(wrapper).toHaveLength(1);
        const iconProps: IconProps = wrapper.find(Icon).instance().props;
        expect(iconProps.color).toBe('red'); // Red icon
    });

    it('renders with no status', () => {
        const systemStatus = undefined;
        const wrapper = mountSystemStatusIcon(systemStatus);
        expect(wrapper).toHaveLength(1);
        const iconProps: IconProps = wrapper.find(Icon).instance().props;
        expect(iconProps.color).toBe('grey'); // Grey icon
    });

    it('renders with degraded status', () => {
        const systemStatus = ClusterServiceStatus.Degraded;
        const wrapper = mountSystemStatusIcon(systemStatus);
        expect(wrapper).toHaveLength(1);
        const iconProps: IconProps = wrapper.find(Icon).instance().props;
        expect(iconProps.color).toBe('yellow'); // Yellow icon
    });
});
