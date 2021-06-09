import { shallow } from 'enzyme';

import RolesPresenter from 'common/src/RolesPresenter';

describe('(Widgets common) RolesPresenter', () => {
    it('renders when direct role is the only group role', () => {
        const role = 'role';
        const wrapper = shallow(<RolesPresenter directRole={role} groupRoles={{ [role]: ['a', 'b'] }} />);

        expect(wrapper.text()).toBe('role (a, b)');
    });

    it('renders when direct role is a group role', () => {
        const role = 'role';
        const wrapper = shallow(
            <RolesPresenter directRole={role} groupRoles={{ [role]: ['a', 'b'], anotherRole: ['c', 'd'] }} />
        );

        expect(wrapper.text()).toBe('role (a, b), anotherRole (c, d)');
    });

    it('renders when direct role is not a group role', () => {
        const wrapper = shallow(<RolesPresenter directRole="role" groupRoles={{ anotherRole: ['c', 'd'] }} />);

        expect(wrapper.text()).toBe('role, anotherRole (c, d)');
    });

    it('renders when there is no direct role', () => {
        const wrapper = shallow(<RolesPresenter groupRoles={{ anotherRole: ['c', 'd'] }} />);

        expect(wrapper.text()).toBe('anotherRole (c, d)');
    });
});
