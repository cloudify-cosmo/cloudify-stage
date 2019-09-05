/**
 * Created by jakubniezgoda on 20/03/2019.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import moment from 'moment';
import Consts from '../../app/utils/consts';
import ConnectedLicensePage from '../../app/containers/LicensePage';
import LicensePage from '../../app/components/LicensePage';
import * as BasicComponents from '../../app/components/basic';

import { createToolbox } from '../../app/utils/Toolbox';
import licenses from '../resources/licenses';
import versions from '../resources/versions';

describe('(Component) LicensePage', () => {
    let licensePageComponent = null;
    let messageContainerComponent = null;
    global.Stage = { Basic: BasicComponents };
    global.moment = (timestamp, inputPattern) => moment(timestamp, inputPattern).utcOffset(0);

    const verifyProps = (canUploadLicense, isProductOperational, license, status) => {
        expect(licensePageComponent.props().canUploadLicense).to.be.eql(canUploadLicense);
        expect(licensePageComponent.props().isProductOperational).to.be.eql(isProductOperational);
        expect(licensePageComponent.props().license).to.be.eql(license);
        expect(licensePageComponent.props().status).to.be.eql(status);
    };

    const verifyHeader = () => {
        const header = messageContainerComponent.find('Header').first();
        expect(header.text()).to.be.eql(' License Management');
        expect(header.find('Icon').props().name).to.be.eql('key');
    };

    const verifyMessage = (messageHeader, icon, isLicenseSwitchButtonVisible) => {
        const descriptionMessage = messageContainerComponent.find('DescriptionMessage');
        expect(descriptionMessage.find('MessageHeader').text()).to.be.eql(messageHeader);
        expect(
            descriptionMessage
                .find('Icon')
                .first()
                .props().name
        ).to.be.eql(icon);
        expect(descriptionMessage.find('LicenseSwitchButton')).to.have.length(isLicenseSwitchButtonVisible ? 1 : 0);
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
            expect(tableCells.at(1).text()).to.be.eql(firstRow);
        }
        if (secondRow !== '') {
            expect(tableCells.at(3).text()).to.be.eql(secondRow);
        }
        if (thirdRow !== '') {
            expect(tableCells.at(5).text()).to.be.eql(thirdRow);
        }
        if (fourthRow !== '') {
            expect(tableCells.at(7).text()).to.be.eql(fourthRow);
        }
        if (fifthRow !== '') {
            expect(tableCells.at(9).text()).to.be.eql(fifthRow);
        }
        if (sixthRow !== '') {
            expect(tableCells.at(11).text()).to.be.eql(sixthRow);
        }
    };

    const verifyUploadLicense = isPresent => {
        const uploadLicense = messageContainerComponent.find('UploadLicense');
        expect(uploadLicense).to.have.length(isPresent ? 1 : 0);
    };

    const verifyFooter = isGoToAppButtonEnabled => {
        const footer = messageContainerComponent.find('Grid');
        expect(footer.find('EulaLink')).to.have.length(1);
        const goToAppButton = footer.find('Button').findWhere(el => el.props().content === 'Go to app');
        expect(goToAppButton).to.have.length(1);
        expect(goToAppButton.props().disabled).to.be.eql(!isGoToAppButtonEnabled);
    };

    const verifySwitchToUpload = isButtonPresent => {
        const descriptionMessage = messageContainerComponent.find('DescriptionMessage');
        const licenseSwitchButton = descriptionMessage.find('LicenseSwitchButton');
        expect(licenseSwitchButton).to.have.length(isButtonPresent ? 1 : 0);
    };

    const getLicenseState = (data, isRequired, status) => {
        return { data, isRequired, status };
    };

    const mockStoreAndRender = async (role, license, version) => {
        const licenseUrl = '/console/sp/?su=%2Flicense';
        const mockStore = configureMockStore();
        const store = mockStore({
            manager: {
                auth: {
                    role,
                    groupSystemRoles: {},
                    tenantsRoles: {
                        default_tenant: {
                            'tenant-role': 'user',
                            roles: ['user']
                        }
                    }
                },
                license,
                permissions: {
                    license_upload: ['sys_admin']
                },
                tenants: {
                    isFetching: false,
                    items: [
                        {
                            name: 'default_tenant'
                        }
                    ],
                    selected: 'default_tenant',
                    lastUpdated: 1553065713112
                },
                version
            }
        });
        createToolbox(store);

        const myMock = fetchMock.sandbox().mock(licenseUrl, { items: [license.data] });
        global.fetch = myMock;

        const componentsTree = mount(
            <Provider store={store}>
                <Router>
                    <ConnectedLicensePage onLicenseChange={_.noop} />
                </Router>
            </Provider>
        );

        licensePageComponent = componentsTree.find(LicensePage);
        messageContainerComponent = componentsTree.find('MessageContainer');

        // Wait until Promise in componentDidMount resolves
        await licensePageComponent.instance().componentDidMount();

        // Check that license was fetch request was called
        expect(myMock.called(licenseUrl)).to.be.true;
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
            const license = getLicenseState({}, true, Consts.LICENSE.EMPTY);
            await mockStoreAndRender('sys_admin', license, versions.premium);
            verifyProps(true, false, {}, Consts.LICENSE.EMPTY);
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
            const license = getLicenseState({}, true, Consts.LICENSE.EMPTY);
            await mockStoreAndRender('default', license, versions.premium);

            verifyProps(false, false, {}, Consts.LICENSE.EMPTY);
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
