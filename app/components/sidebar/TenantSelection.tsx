import _ from 'lodash';
import React, { FunctionComponent, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import EventBus from '../../utils/EventBus';
import { Dropdown, Input, Loader } from '../basic';

import { changeTenant, getTenants } from '../../actions/tenants';
import { useResettableState } from '../../utils/hooks';
import type { ReduxState } from '../../reducers';
import IconSelection from '../IconSelection';
import SideBarItem from './SideBarItem';
import StageUtils from '../../utils/stageUtils';

const t = StageUtils.getT('users');

interface TenantSelectionProps {
    expanded: boolean;
}

const TenantSelection: FunctionComponent<TenantSelectionProps> = ({ expanded }) => {
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

    const tenantMenuTrigger = (
        <SideBarItem>
            <IconSelection enabled={false} value="user circle" />
            {expanded && (selectedTenant || t('noTenants'))}
        </SideBarItem>
    );

    return (
        <Dropdown trigger={tenantMenuTrigger} onClose={clearSearch} pointing="left" icon={null} fluid>
            <Dropdown.Menu style={{ margin: 0 }}>
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
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default TenantSelection;
