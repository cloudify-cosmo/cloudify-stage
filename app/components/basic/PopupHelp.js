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
     * @property {object} trigger help popup triggering element (on focus and on hover)
     * @property {object} content help popup content
     */
    static propTypes = {
        trigger: PropTypes.object.isRequired,
        content: PropTypes.string.isRequired
    };

    render() {
        return (
            <Popup position='left center' on={['hover', 'focus']}>
                <Popup.Trigger>
                    {this.props.trigger}
                </Popup.Trigger>
                <Popup.Content>
                    <Icon name="info circle"/>{this.props.content}
                </Popup.Content>
            </Popup>
        );
    }
}
