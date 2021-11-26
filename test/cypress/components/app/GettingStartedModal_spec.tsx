import React from 'react';
import { ThemeProvider } from 'styled-components';

import '../initAppContext';

import GettingStartedModal from 'app/components/GettingStartedModal';
import StageUtils from 'app/utils/stageUtils';
import userConfig from 'conf/userConfig.json';
import { mountWithProvider } from '../utils';

describe('GettingStartedModal', () => {
    it('renders', () => {
        cy.interceptSp('GET', '/users/', { show_getting_started: true });
        cy.stub(StageUtils, 'isUserAuthorized').returns(true);

        mountWithProvider(
            <ThemeProvider theme={userConfig.whiteLabel}>
                <GettingStartedModal />
            </ThemeProvider>
        );

        cy.contains('Welcome to Cloudify');
    });
});
