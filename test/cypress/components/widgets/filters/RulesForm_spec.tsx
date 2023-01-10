import React from 'react';
import { mount } from 'cypress/react';

import '../../initAppContext';
import 'app/utils/props/Toolbox';
import RulesForm from 'app/widgets/common/filters/RulesForm';

describe('RulesForm', () => {
    it('renders without any fields', () => {
        mount(
            <RulesForm
                resourceType="deployments"
                initialFilters={[]}
                onChange={() => {}}
                markErrors={false}
                toolbox={{} as Stage.Types.Toolbox}
                minLength={1}
            />
        );

        cy.get('.fields').should('have.length', 1);
        cy.contains('button', 'Add new rule');
    });
});
