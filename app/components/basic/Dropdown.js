/**
 * Created by pposel on 23/01/2017.
 */

import React from 'react';
import { Dropdown } from 'semantic-ui-react';

/**
 * Dropdown is a component which extends [Dropdown](https://react.semantic-ui.com/modules/dropdown) component from Semantic-UI-React framework
 * See [Dropdown](https://react.semantic-ui.com/modules/dropdown) component from Semantic-UI-React framework for details about props and usage details.
 *
 * ## Access
 * `Stage.Basic.Form.Dropdown` or `Stage.Basic.Dropdown`
 *
 * ## Usage
 * ```
 * let options = [
 *   {text: 'Option 1', value: 'option1'},
 *   {text: 'Option 2', value: 'option2'},
 *   {text: 'Option 3', value: 'option3'}
 * ];
 * <Dropdown search selection options={options} value={options[0].value}/>
 * ```
 *
 * ### Dropdown - closed
 * ![Dropdown_0](manual/asset/Dropdown_0.png)
 *
 * ### Dropdown - opened (after click)
 * ![Dropdown_1](manual/asset/Dropdown_1.png)
 */

export default class extends Dropdown {
    render() {
        const addOptionValueAttribute = (options) => {
            return _.map(options, (option) => ({...option, 'option-value': option.value || 'empty-option'}));
        }
        let props = {...this.props};
        if (props.options) {
            props.options = addOptionValueAttribute(props.options);
        }

        return (
            <Dropdown {...props}>
                {this.props.children}
            </Dropdown>
        );
    }
}