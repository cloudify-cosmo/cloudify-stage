import '../../initAppContext';
import 'widgets/common/src/props/Toolbox';
import React from 'react';
import { mount } from '@cypress/react';
import RulesForm from 'widgets/common/src/filters/RulesForm';

describe('RulesForm', () => {
    it('renders', () => {
        mount(
            <RulesForm initialFilters={[]} onChange={() => {}} markErrors={false} toolbox={{} as Stage.Types.Toolbox} />
        );

        cy.get('.fields').should('have.length', 1);
        cy.contains('button', 'Add new rule');
    });
});
