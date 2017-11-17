/**
 * Created by pposel on 23/01/2017.
 */

import React, { Children, cloneElement } from 'react';
import { Dropdown as DropdownSemanticUiReact, DropdownMenu, DropdownHeader } from 'semantic-ui-react'
import { createShorthand } from '../../../node_modules/semantic-ui-react/dist/commonjs/lib';

/**
 * Dropdown is a component which extends [Dropdown](https://react.semantic-ui.com/modules/dropdown) component from Semantic-UI-React framework
 * and wraps it with use of [Portal](https://react.semantic-ui.com/addons/portal) component from Semantic-UI-React framework.
 *
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
export default class Dropdown extends DropdownSemanticUiReact {

    renderMenu = () => {
        const { open } = this.state;
        const menuClasses = open ? 'visible' : '';
        const ariaOptions = this.getDropdownMenuAriaOptions();

        const {
            children,
            header
        } = this.props;


        // single menu child
        // Used only for dropdown menu, we are currently using Popup Menu so I do not port it to the body.
        if (!_.isNil(children)) {
            const menuChild = Children.only(children);
            const className = [menuClasses, menuChild.props.className].join(' ');

            return cloneElement(menuChild, { className, ...ariaOptions })
        }

        return (
            <DropdownMenu {...ariaOptions} className={`${menuClasses} ${name}`} >
                {createShorthand(DropdownHeader, val => ({content: val}), header)}
                {this.renderOptions()}
            </DropdownMenu>
        )
    }

}

Dropdown.defaultProps = Object.assign({}, Dropdown.defaultProps,
                                            {selectOnBlur: false, openOnFocus: false, closeOnBlur: false});