import React from 'react';
import { ThemeProvider } from 'styled-components';

import '../initAppContext';

import GettingStartedModal from 'app/components/GettingStartedModal';
import StageUtils from 'app/utils/stageUtils';
import userConfig from 'conf/userConfig.json';
import type { ManagerData } from 'app/reducers/managerReducer';
import { emptyState } from 'app/reducers/managerReducer';
import { mountWithProvider } from '../utils';

describe('GettingStartedModal', () => {
    it('renders', () => {
        cy.stub(StageUtils, 'isUserAuthorized').returns(true);

        mountWithProvider(
            <ThemeProvider theme={userConfig.whiteLabel}>
                <GettingStartedModal />
            </ThemeProvider>,
            {
                manager: {
                    auth: { ...emptyState.auth, showGettingStarted: true }
                } as ManagerData
            }
        );

        cy.intercept(
            'GET',
            'https://repository.cloudifysource.org/cloudify/getting-started/6.4/gettingStarted.schema.json'
        ).as('gettingStartedSchema');

        cy.wait('@gettingStartedSchema');

        cy.intercept(
            'GET',
            'https://repository.cloudifysource.org/cloudify/getting-started/6.4/cloudSetup.schema.json'
        ).as('cloudSetupSchema');

        cy.wait('@cloudSetupSchema');

        cy.contains('Welcome to Cloudify');
    });
});
