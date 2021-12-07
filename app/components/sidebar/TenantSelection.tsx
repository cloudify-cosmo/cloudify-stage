import _ from 'lodash';
import React, { FunctionComponent, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import EventBus from '../../utils/EventBus';
import { Dropdown, Input, Loader } from '../basic';

import { changeTenant, getTenants } from '../../actions/tenants';
import { useResettableState } from '../../utils/hooks';
import type { ReduxState } from '../../reducers';
import StageUtils from '../../utils/stageUtils';
import SideBarDropdownItem from './SideBarDropdownItem';

const t = StageUtils.getT('users');

const TenantSelection: FunctionComponent = () => {
    const [search, setSearch, clearSearch] = useResettableState('');
    const manager = useSelector((state: ReduxState) => state.manager || {});
    const dispatch = useDispatch();

    function onTenantsRefresh() {
        dispatch(getTenants());
    }

    useEffect(() => {
        const eventName = 'menu.tenants:refresh';
        EventBus.on(eventName, onTenantsRefresh);
        return () => EventBus.off(eventName, onTenantsRefresh);
    }, [onTenantsRefresh]);

    function onTenantSelected(tenant: { name: string }) {
        dispatch(changeTenant(tenant.name));
    }

    const { tenants } = manager;
    if (!tenants || !tenants.items || tenants.isFetching) {
        return <Loader active inverted inline size="small" />;
    }

    const filteredTenants = _(tenants.items)
        .filter(tenant => _.includes(tenant.name, search))
        .sortBy('name')
        .value();
    const selectedTenant = tenants.selected || _.get(tenants, 'items[0].name');

    return (
        <SideBarDropdownItem icon="user circle" label={selectedTenant || t('noTenants')} onClose={clearSearch}>
            <Dropdown.Header>{t('tenantsHeader')}</Dropdown.Header>
            <Dropdown.Menu scrolling>
                {filteredTenants.map(tenant => (
                    <Dropdown.Item
                        key={tenant.name}
                        text={tenant.name}
                        selected={tenant.name === selectedTenant}
                        active={tenant.name === selectedTenant}
                        onClick={() => onTenantSelected(tenant)}
                    />
                ))}
            </Dropdown.Menu>
            <Input
                icon="search"
                iconPosition="left"
                className="search"
                value={search}
                onClick={(e: Event) => e.stopPropagation()}
                onChange={(e, { value }) => {
                    e.stopPropagation();
                    setSearch(value);
                }}
            />
        </SideBarDropdownItem>
    );
};

export default TenantSelection;
