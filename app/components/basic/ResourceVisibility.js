/**
 * Created by pposel on 08/05/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Icon, Popup, Button, Message, Confirm } from 'semantic-ui-react';
import _ from 'lodash';
import VisibilityIcon from './VisibilityIcon';
import consts from '../../utils/consts';

/**
 * ResourceVisibility - an icon representing resource visibility. If allowed setting different visibility than current,
 * clicking the icon will show a popup with the visibility options. To approve the visibility change a confirm modal is shown.
 *
 * ## Access
 * `Stage.Basic.ResourceVisibility`
 *
 * ## Usage
 *
 * ### ResourceVisibility (show)
 *
 * ![ResourceVisibility](manual/asset/resourceVisibility/ResourceVisibility_0.png)
 * ```
 * <ResourceVisibility visibility={consts.visibility.PRIVATE.name} />
 * <ResourceVisibility visibility={consts.visibility.TENANT.name} />
 * <ResourceVisibility visibility={consts.visibility.GLOBAL.name} />
 *```
 */
export default class ResourceVisibility extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openConfirm: false,
            visibility: null,
            popupOpened: false
        };
    }

    /**
     * @property {string} [visibility='unknown'] resource visibility - in ['private', 'tenant, 'global', 'unknown']
     * @property {func} [onSetVisibility(visibility)] function to be called when user confirm changing visibility
     * @property {Array} [allowedSettingTo=['tenant']] array of visibilities the item is allowed to change to
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        visibility: PropTypes.oneOf([
            consts.visibility.PRIVATE.name,
            consts.visibility.TENANT.name,
            consts.visibility.GLOBAL.name,
            consts.visibility.UNKNOWN.name
        ]),
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        className: PropTypes.string
    };

    static defaultProps = {
        visibility: consts.visibility.UNKNOWN.name,
        className: ''
    };

    render() {
        const setTenantAllowed =
            _.includes(this.props.allowedSettingTo, consts.visibility.TENANT.name) &&
            _.isEqual(this.props.visibility, consts.visibility.PRIVATE.name);
        const setGlobalAllowed =
            _.includes(this.props.allowedSettingTo, consts.visibility.GLOBAL.name) &&
            !_.isEqual(this.props.visibility, consts.visibility.GLOBAL.name);
        const canChangeVisibility = setGlobalAllowed || setTenantAllowed;
        const icon = (
            <VisibilityIcon
                visibility={this.props.visibility}
                className={this.props.className}
                link={setGlobalAllowed}
                onClick={e => e.stopPropagation()}
                bordered
                disabled={!canChangeVisibility}
                showTitle={!this.state.popupOpened}
            />
        );

        const popupContent = (
            <div className="setVisibility">
                <Message warning content="This operation cannot be reverted" />
                {setTenantAllowed && (
                    <Button
                        animated
                        color="green"
                        onClick={e => {
                            e.stopPropagation();
                            this.setState({
                                openConfirm: true,
                                visibility: consts.visibility.TENANT.name,
                                popupOpened: false
                            });
                        }}
                    >
                        <Button.Content visible>Tenant</Button.Content>
                        <Button.Content hidden>
                            <Icon name="user" />
                        </Button.Content>
                    </Button>
                )}
                {setGlobalAllowed && (
                    <Button
                        animated
                        color="blue"
                        onClick={e => {
                            e.stopPropagation();
                            this.setState({
                                openConfirm: true,
                                visibility: consts.visibility.GLOBAL.name,
                                popupOpened: false
                            });
                        }}
                    >
                        <Button.Content visible>Global</Button.Content>
                        <Button.Content hidden>
                            <Icon name="globe" />
                        </Button.Content>
                    </Button>
                )}
            </div>
        );

        const popup = (
            <Popup
                flowing
                trigger={icon}
                on="click"
                header="Change resource visibility"
                content={popupContent}
                open={this.state.popupOpened}
                onOpen={() => this.setState({ popupOpened: true })}
                onClose={() => this.setState({ popupOpened: false })}
            />
        );

        return canChangeVisibility ? (
            <span>
                {popup}
                {(setTenantAllowed || setGlobalAllowed) && (
                    <Confirm
                        className="setVisibilityModal"
                        content={`Are you sure you want to change resource visibility to ${this.state.visibility}?`}
                        open={this.state.openConfirm}
                        onCancel={e => {
                            e.stopPropagation();
                            this.setState({ openConfirm: false, visibility: null });
                        }}
                        onConfirm={e => {
                            e.stopPropagation();
                            this.props.onSetVisibility(this.state.visibility);
                            this.setState({ openConfirm: false, visibility: null });
                        }}
                    />
                )}
            </span>
        ) : (
            icon
        );
    }
}
