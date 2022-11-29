import _ from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { InputOnChangeData } from 'semantic-ui-react';

import { Dropdown, Input, Loading } from '../basic';
import { changeTenant, getTenants } from '../../actions/manager/tenants';
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

    function onTenantSelected(tenant: string) {
        dispatch(changeTenant(tenant));
    }

    function handleTenantSearch(e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) {
        e.stopPropagation();
        setSearch(value);
    }

    const filteredTenants = _(tenants.items || [])
        .filter(tenant => _.includes(tenant, search))
        .sortBy('name')
        .value();

    const selectedTenant = tenants.selected || tenants.items?.[0];

    return (
        <SideBarDropdownItem
            icon="cloudify-user-cog"
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
                                key={tenant}
                                text={tenant}
                                selected={tenant === selectedTenant}
                                active={tenant === selectedTenant}
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
