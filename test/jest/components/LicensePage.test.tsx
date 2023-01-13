/* eslint-disable jest/expect-expect */

import type { ReactWrapper } from 'enzyme';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import type { SemanticICONS } from 'semantic-ui-react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import Consts from 'utils/consts';
import type { LicensePageProps } from 'components/license/LicensePage';
import ConnectedLicensePage, { LicensePage } from 'components/license/LicensePage';

import { createToolbox } from 'utils/Toolbox';
import type { LicenseData, LicenseStatus } from 'reducers/managerReducer';
import React from 'react';
import type { ReduxState } from 'reducers';
import type { ReduxStore } from 'configureStore';
import type { LicenseResponse, VersionResponse } from 'backend/handler/AuthHandler.types';
import licenses from '../resources/licenses';
import versions from '../resources/versions';

describe('(Component) LicensePage', () => {
    let licensePageComponent: ReactWrapper<LicensePageProps>;
    let messageContainerComponent: ReactWrapper;

    const verifyProps = (
        canUploadLicense: boolean,
        isProductOperational: boolean,
        license: LicenseResponse | null,
        status: LicenseStatus
    ) => {
        expect(licensePageComponent.props().canUploadLicense).toEqual(canUploadLicense);
        expect(licensePageComponent.props().isProductOperational).toEqual(isProductOperational);
        expect(licensePageComponent.props().license).toEqual(license);
        expect(licensePageComponent.props().status).toEqual(status);
    };

    const verifyHeader = () => {
        const header = messageContainerComponent.find('Header').first();
        expect(header.text()).toBe(' License Management');
        expect(header.find('Icon').props().name).toBe('key');
    };

    const verifyMessage = (messageHeader: string, icon: SemanticICONS, isLicenseSwitchButtonVisible: boolean) => {
        const descriptionMessage = messageContainerComponent.find('DescriptionMessage');
        expect(descriptionMessage.find('MessageHeader').text()).toBe(messageHeader);
        expect(descriptionMessage.find('Icon').first().props().name).toBe(icon);
        expect(descriptionMessage.find('LicenseSwitchButton')).toHaveLength(isLicenseSwitchButtonVisible ? 1 : 0);
    };

    const verifyCurrentLicense = (
        firstRow = '',
        secondRow = '',
        thirdRow = '',
        fourthRow = '',
        fifthRow = '',
        sixthRow = ''
    ) => {
        const currentLicense = messageContainerComponent.find('CurrentLicense');
        const tableCells = currentLicense.find('TableCell');
        if (firstRow !== '') {
            expect(tableCells.at(1).text()).toBe(firstRow);
        }
        if (secondRow !== '') {
            expect(tableCells.at(3).text()).toBe(secondRow);
        }
        if (thirdRow !== '') {
            expect(tableCells.at(5).text()).toBe(thirdRow);
        }
        if (fourthRow !== '') {
            expect(tableCells.at(7).text()).toBe(fourthRow);
        }
        if (fifthRow !== '') {
            expect(tableCells.at(9).text()).toBe(fifthRow);
        }
        if (sixthRow !== '') {
            expect(tableCells.at(11).text()).toBe(sixthRow);
        }
    };

    const verifyUploadLicense = (isPresent: boolean) => {
        const uploadLicense = messageContainerComponent.find('UploadLicense');
        expect(uploadLicense).toHaveLength(isPresent ? 1 : 0);
    };

    const verifyFooter = (isGoToAppButtonEnabled: boolean) => {
        const footer = messageContainerComponent.find('Grid');
        expect(footer.find('EulaLink')).toHaveLength(1);
        const goToAppButton = footer.find('Button').findWhere(el => el.props().content === 'Go to app');
        expect(goToAppButton).toHaveLength(1);
        expect(goToAppButton.props().disabled).toBe(!isGoToAppButtonEnabled);
    };

    const verifySwitchToUpload = (isButtonPresent: boolean) => {
        const descriptionMessage = messageContainerComponent.find('DescriptionMessage');
        const licenseSwitchButton = descriptionMessage.find('LicenseSwitchButton');
        expect(licenseSwitchButton).toHaveLength(isButtonPresent ? 1 : 0);
    };

    const getLicenseState = (data: LicenseResponse | null, isRequired: boolean, status: LicenseStatus) => {
        return { data, isRequired, status };
    };

    const mockStoreAndRender = async (role: string, license: LicenseData, version: VersionResponse) => {
        const licenseUrl = '/console/sp/license';
        const mockStore = configureMockStore<Partial<ReduxState>>();
        const store = mockStore({
            manager: {
                auth: {
                    username: 'test',
                    identityProviders: ['local'],
                    showGettingStarted: false,
                    state: 'loggedIn',
                    role,
                    groupSystemRoles: {},
                    tenantsRoles: {
                        default_tenant: {
                            'tenant-role': 'user',
                            roles: ['user']
                        }
                    },
                    error: null
                },
                license,
                permissions: {
                    license_upload: ['sys_admin']
                },
                tenants: {
                    isFetching: false,
                    items: ['default_tenant'],
                    selected: 'default_tenant',
                    lastUpdated: 1553065713112
                },
                version,
                clusterStatus: {},
                maintenance: '',
                roles: [],
                lastUpdated: null
            }
        });
        createToolbox(store as ReduxStore);

        const myMock = fetchMock.sandbox().mock(licenseUrl, { items: [license.data] });
        (global as any).fetch = myMock;

        const componentsTree = mount(
            <Provider store={store}>
                <Router>
                    <ConnectedLicensePage />
                </Router>
            </Provider>
        );

        licensePageComponent = componentsTree.find(LicensePage);
        messageContainerComponent = componentsTree.find('MessageContainer');

        // Wait until Promise in componentDidMount resolves
        await licensePageComponent.instance().componentDidMount?.();

        // Check that license was fetch request was called
        expect(myMock.called(licenseUrl)).toBeTruthy();
    };

    describe('for admin users', () => {
        it('allows license management when paying license is active', async () => {
            const license = getLicenseState(licenses.activePayingLicense, true, Consts.LICENSE.ACTIVE);
            await mockStoreAndRender('sys_admin', license, versions.premium);

            verifyProps(true, true, licenses.activePayingLicense, Consts.LICENSE.ACTIVE);
            verifyHeader();
            verifyMessage('License is valid', 'checkmark', true);
            verifySwitchToUpload(true);
            verifyCurrentLicense('24-11-2019', '4.6', 'Spire', 'HA, Awesomeness', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(true);
        });

        it('allows license management when trial license is active', async () => {
            const license = getLicenseState(licenses.activeTrialLicense, true, Consts.LICENSE.ACTIVE);
            await mockStoreAndRender('sys_admin', license, versions.premium);

            verifyProps(true, true, licenses.activeTrialLicense, Consts.LICENSE.ACTIVE);
            verifyHeader();
            verifyMessage('License is valid', 'checkmark', true);
            verifySwitchToUpload(true);
            verifyCurrentLicense('24-11-2019', '4.6', 'Spire', 'HA, Awesomeness', 'Yes', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(true);
        });

        it('allows license management when paying license has expired', async () => {
            const license = getLicenseState(licenses.expiredPayingLicense, true, Consts.LICENSE.EXPIRED);
            await mockStoreAndRender('sys_admin', license, versions.premium);

            verifyProps(true, true, licenses.expiredPayingLicense, Consts.LICENSE.EXPIRED);
            verifyHeader();
            verifyMessage('Product license has expired', 'clock outline', true);
            verifySwitchToUpload(true);
            verifyCurrentLicense('24-11-2018', '4.6', 'Spire', 'HA, Awesomeness', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(true);
        });

        it('allows license management when trial license has expired', async () => {
            const license = getLicenseState(licenses.expiredTrialLicense, true, Consts.LICENSE.EXPIRED);
            await mockStoreAndRender('sys_admin', license, versions.premium);

            verifyProps(true, false, licenses.expiredTrialLicense, Consts.LICENSE.EXPIRED);
            verifyHeader();
            verifyMessage('The trial license has expired', 'clock outline', true);
            verifySwitchToUpload(true);
            verifyCurrentLicense('24-11-2018', '4.6', 'Spire', 'HA, Awesomeness', 'Yes', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(false);
        });

        it('allows license management when no license is active', async () => {
            const license = getLicenseState(null, true, Consts.LICENSE.EMPTY);
            await mockStoreAndRender('sys_admin', license, versions.premium);
            verifyProps(true, false, null, Consts.LICENSE.EMPTY);
            verifyHeader();
            verifyMessage('No active license', 'ban', false);
            verifySwitchToUpload(false);
            verifyUploadLicense(false);
            verifyFooter(false);
        });
    });

    describe('for non-admin users', () => {
        it('allows to view license when paying license is active', async () => {
            const license = getLicenseState(licenses.activePayingLicense, true, Consts.LICENSE.ACTIVE);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, true, licenses.activePayingLicense, Consts.LICENSE.ACTIVE);
            verifyHeader();
            verifyMessage('License is valid', 'checkmark', false);
            verifySwitchToUpload(false);
            verifyCurrentLicense('24-11-2019', '4.6', 'Spire', 'HA, Awesomeness', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(true);
        });

        it('allows to view license when trial license is active', async () => {
            const license = getLicenseState(licenses.activeTrialLicense, true, Consts.LICENSE.ACTIVE);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, true, licenses.activeTrialLicense, Consts.LICENSE.ACTIVE);
            verifyHeader();
            verifyMessage('License is valid', 'checkmark', false);
            verifySwitchToUpload(false);
            verifyCurrentLicense('24-11-2019', '4.6', 'Spire', 'HA, Awesomeness', 'Yes', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(true);
        });

        it('allows to view license when paying license has expired', async () => {
            const license = getLicenseState(licenses.expiredPayingLicense, true, Consts.LICENSE.EXPIRED);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, true, licenses.expiredPayingLicense, Consts.LICENSE.EXPIRED);
            verifyHeader();
            verifyMessage('Product license has expired', 'clock outline', false);
            verifySwitchToUpload(false);
            verifyCurrentLicense('24-11-2018', '4.6', 'Spire', 'HA, Awesomeness', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(true);
        });

        it('allows to view license when trial license has expired', async () => {
            const license = getLicenseState(licenses.expiredTrialLicense, true, Consts.LICENSE.EXPIRED);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, false, licenses.expiredTrialLicense, Consts.LICENSE.EXPIRED);
            verifyHeader();
            verifyMessage('The trial license has expired', 'clock outline', false);
            verifySwitchToUpload(false);
            verifyCurrentLicense('24-11-2018', '4.6', 'Spire', 'HA, Awesomeness', 'Yes', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(false);
        });

        it('allows to view license when no license is active', async () => {
            const license = getLicenseState(null, true, Consts.LICENSE.EMPTY);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, false, null, Consts.LICENSE.EMPTY);
            verifyHeader();
            verifyMessage('No active license', 'ban', false);
            verifySwitchToUpload(false);
            verifyUploadLicense(false);
            verifyFooter(false);
        });

        it('allows to view license when license without expiration date is active', async () => {
            const license = getLicenseState(licenses.noExpirationDateLicense, true, Consts.LICENSE.ACTIVE);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, true, licenses.noExpirationDateLicense, Consts.LICENSE.ACTIVE);
            verifyHeader();
            verifyMessage('License is valid', 'checkmark', false);
            verifySwitchToUpload(false);
            verifyCurrentLicense('Never', '4.6', 'Spire', 'Mock1, Mock2', 'Yes', 'CloudifyMock');
            verifyUploadLicense(false);
            verifyFooter(true);
        });

        it('allows to view license when license without capabilities is active', async () => {
            const license = getLicenseState(licenses.noCapabilitiesLicense, true, Consts.LICENSE.ACTIVE);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, true, licenses.noCapabilitiesLicense, Consts.LICENSE.ACTIVE);
            verifyHeader();
            verifyMessage('License is valid', 'checkmark', false);
            verifySwitchToUpload(false);
            verifyCurrentLicense('24-11-2019', '4.6', 'Spire', 'Yes', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(true);
        });

        it('allows to view license when license without version is active', async () => {
            const license = getLicenseState(licenses.noCapabilitiesLicense, true, Consts.LICENSE.ACTIVE);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, true, licenses.noCapabilitiesLicense, Consts.LICENSE.ACTIVE);
            verifyHeader();
            verifyMessage('License is valid', 'checkmark', false);
            verifySwitchToUpload(false);
            verifyCurrentLicense('24-11-2019', '4.6', 'Spire', 'Yes', 'customer123');
            verifyUploadLicense(false);
            verifyFooter(true);
        });
    });
});
