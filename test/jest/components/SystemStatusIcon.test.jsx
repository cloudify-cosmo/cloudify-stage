/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import { mount } from 'enzyme';
import SystemStatusIcon from 'components/status/SystemStatusIcon';
import * as BasicComponents from 'components/basic';

describe('(Component) SystemStatusIcon', () => {
    let wrapper;
    let systemStatus;
    global.Stage = { Basic: BasicComponents };
    const { Icon } = Stage.Basic;

    beforeEach(() => {
        systemStatus = 'OK';

        wrapper = mount(<SystemStatusIcon systemStatus={systemStatus} />);
    });

    it('renders with available status ', () => {
        systemStatus = 'OK';
        wrapper.setProps({ systemStatus });
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(Icon).instance().props.color).toBe('green'); // Green icon
    });

    it('renders with unavailable status ', () => {
        systemStatus = 'Fail';
        wrapper.setProps({ systemStatus });
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(Icon).instance().props.color).toBe('red'); // Red icon
    });

    it('renders with no status ', () => {
        systemStatus = undefined;
        wrapper.setProps({ systemStatus });
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(Icon).instance().props.color).toBe('grey'); // Grey icon
    });

    it('renders with degraded status', () => {
        systemStatus = 'Degraded';
        wrapper.setProps({ systemStatus });
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(Icon).instance().props.color).toBe('yellow'); // Yellow icon
    });
});
