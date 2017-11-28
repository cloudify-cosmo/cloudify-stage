/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes, Children, cloneElement } from 'react';
import { Dropdown as DropdownSemanticUiReact, DropdownMenu, DropdownHeader } from 'semantic-ui-react'
import { createShorthand, useKeyOnly, useKeyOrValueAndKey, isBrowser } from 'semantic-ui-react/dist/commonjs/lib';
import Portal from 'semantic-ui-react/dist/commonjs/addons/Portal';

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

    componentWillMount() {
        super.componentWillMount();
        window.addEventListener('scroll', this.hideOnScroll)
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        window.removeEventListener('scroll', this.hideOnScroll);
    }

    hideOnScroll = (e) => {
        if (this.state.open) {
            this.close(e);
        }
    }

    computePopupStyle() {
        var coords = this.ref.getBoundingClientRect();

        const style = { position: 'absolute' };

        // Do not access window/document when server side rendering
        if (!isBrowser) return style;

        const { pageYOffset, pageXOffset } = window;

        style.left = Math.round(coords.left + pageXOffset) + 'px';
        style.top = Math.round(coords.top + coords.height + pageYOffset - 2) + 'px';
        style.width = coords.width + 'px';

        return style
    }

    renderMenu = () => {
        const { open } = this.state;
        const menuClasses = open ? 'visible' : '';
        const ariaOptions = this.getDropdownMenuAriaOptions();

        const {
            children,
            header,
            basic,
            button,
            className,
            compact,
            floating,
            inline,
            item,
            labeled,
            multiple,
            pointing,
            search,
            selection,
            simple,
            loading,
            error,
            disabled,
            scrolling
        } = this.props;

        // Classes
        const classes = [
            'ui',
            useKeyOnly(open, 'active visible'),
            useKeyOnly(disabled, 'disabled'),
            useKeyOnly(error, 'error'),
            useKeyOnly(loading, 'loading'),
            useKeyOnly(basic, 'basic'),
            useKeyOnly(button, 'button'),
            useKeyOnly(compact, 'compact'),
            useKeyOnly(floating, 'floating'),
            useKeyOnly(inline, 'inline'),
            useKeyOnly(labeled, 'labeled'),
            useKeyOnly(item, 'item'),
            useKeyOnly(multiple, 'multiple'),
            useKeyOnly(search, 'search'),
            useKeyOnly(selection, 'selection'),
            useKeyOnly(simple, 'simple'),
            useKeyOnly(scrolling, 'scrolling'),
            useKeyOrValueAndKey(pointing, 'pointing'),
            'dropdown',
            'dropdownPortal',
            className
        ].filter(e => !_.isEmpty(e)).join(' ');

        var style = {};
        if (this.ref && open) {
            style = this.computePopupStyle();
        }

        // single menu child
        // Used only for dropdown menu, we are currently using Popup Menu so I do not port it to the body.
        if (!_.isNil(children)) {
            const menuChild = Children.only(children);
            const className = [menuClasses, menuChild.props.className].join(' ');

            return cloneElement(menuChild, { className, ...ariaOptions })
        }

        return (
            <Portal open={open} className={classes}>
                <DropdownMenu {...ariaOptions} className={`${menuClasses} ${name}`} style={style}>
                    {createShorthand(DropdownHeader, val => ({ content: val }), header)}
                    {this.renderOptions()}
                </DropdownMenu>
            </Portal>
        )
    }

}

Dropdown.defaultProps = Object.assign({}, Dropdown.defaultProps,
                                            {selectOnBlur: false, openOnFocus: false, closeOnBlur: false});