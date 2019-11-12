import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Popup } from './index';

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
     *
     * @property {any} content help popup content
     * @property {any} [header=''] help popup header
     * @property {any} [trigger=<Icon name="help circle" />] help popup triggering element (on hover and focus)
     */
    static propTypes = {
        content: PropTypes.any.isRequired,
        header: PropTypes.any,
        trigger: PropTypes.any
    };

    static defaultProps = {
        header: '',
        trigger: <Icon name="help circle" />
    };

    render() {
        const popupProps = _.omit(this.props, _.keys(PopupHelp.propTypes));
        return (
            <Popup on={['hover', 'focus']} hoverable wide="very" {...popupProps}>
                {!_.isEmpty(this.props.header) && <Popup.Header>{this.props.header}</Popup.Header>}
                <Popup.Trigger>{this.props.trigger}</Popup.Trigger>
                <Popup.Content>{this.props.content}</Popup.Content>
            </Popup>
        );
    }
}
