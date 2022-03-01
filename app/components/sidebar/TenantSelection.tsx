import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputOnChangeData } from 'semantic-ui-react';

import { Dropdown, Input, Loading } from '../basic';
import { changeTenant, getTenants } from '../../actions/tenants';
import { useResettableState } from '../../utils/hooks';
import type { ReduxState } from '../../reducers';
import StageUtils from '../../utils/stageUtils';
import SideBarDropdownItem from './SideBarDropdownItem';

const t = StageUtils.getT('users');

const TenantSelection: FunctionComponent = () => {
    const [search, setSearch, clearSearch] = useResettableState('');
    const manager = useSelector((state: ReduxState) => state.manager || {});
    const { tenants } = manager;
    const dispatch = useDispatch();

    const isLoadingTenants = !tenants.items || tenants.isFetching;

    function refreshTenants() {
        dispatch(getTenants());
    }

    function onTenantSelected(tenant: { name: string }) {
        dispatch(changeTenant(tenant.name));
    }

    function handleTenantSearch(e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) {
        e.stopPropagation();
        setSearch(value);
    }

    const filteredTenants = _(tenants.items || [])
        .filter(tenant => _.includes(tenant.name, search))
        .sortBy('name')
        .value();

    const selectedTenant = tenants.selected || _.get(tenants, 'items[0].name');

    return (
        <SideBarDropdownItem
            icon="user circle"
            label={selectedTenant || t('noTenants')}
            onClose={clearSearch}
            onOpen={refreshTenants}
        >
            <Dropdown.Header>{t('tenantsHeader')}</Dropdown.Header>
            <Dropdown.Menu scrolling>
                {isLoadingTenants ? (
                    <Loading style={{ height: 80 }} />
                ) : (
                    <>
                        {filteredTenants.map(tenant => (
                            <Dropdown.Item
                                key={tenant.name}
                                text={tenant.name}
                                selected={tenant.name === selectedTenant}
                                active={tenant.name === selectedTenant}
                                onClick={() => onTenantSelected(tenant)}
                            />
                        ))}
                    </>
                )}
            </Dropdown.Menu>
            <Input
                icon="search"
                iconPosition="left"
                className="search"
                value={search}
                onClick={(e: Event) => e.stopPropagation()}
                onChange={handleTenantSearch}
            />
        </SideBarDropdownItem>
    );
};

export default TenantSelection;
