import '../initAppContext';
import React from 'react';
import { mount } from '@cypress/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import GettingStartedModal from 'app/components/GettingStartedModal';
import StageUtils from 'app/utils/stageUtils';
import userConfig from 'conf/userConfig.json';
import createRootReducer from 'app/reducers';

describe('GettingStartedModal', () => {
    it('renders', () => {
        cy.interceptSp('GET', '/users/null', { show_getting_started: true });
        cy.stub(StageUtils, 'isUserAuthorized').returns(true);

        mount(
            <Provider store={createStore(createRootReducer(createBrowserHistory()))}>
                <ThemeProvider theme={userConfig.whiteLabel}>
                    <GettingStartedModal />
                </ThemeProvider>
            </Provider>
        );

        cy.contains('Welcome to Cloudify');
    });
});
