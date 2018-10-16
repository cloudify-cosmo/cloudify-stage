import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Popup } from './index'

/**
 * PopupHelp is a component which uses [Popup](https://react.semantic-ui.com/modules/popup) component to display
 * help popup
 *
 * ## Access
 * `Stage.Basic.PopupHelp`
 *
 * ## Usage
 * ![PopupHelp](manual/asset/PopupHelp.png)
 * ```
 * <PopupHelp trigger={<Icon name='help' />} content={'Help information'} />
 * ```
 */
export default class PopupHelp extends React.Component {

    /**
     * propTypes
     * @property {object} [trigger=<Icon name="help circle" />] help popup triggering element (on hover and focus)
     * @property {object} content help popup content
     */
    static propTypes = {
        trigger: PropTypes.object,
        content: PropTypes.string.isRequired
    };

    static defaultProps = {
        trigger: (<Icon name="help circle"/>)
    };

    render() {
        let popupProps = _.omit(this.props, _.keys(PopupHelp.propTypes));
        return (
            <Popup on={['hover', 'focus']} {...popupProps}>
                <Popup.Trigger>
                    {this.props.trigger}
                </Popup.Trigger>
                <Popup.Content>
                    {this.props.content}
                </Popup.Content>
            </Popup>
        );
    }
}
