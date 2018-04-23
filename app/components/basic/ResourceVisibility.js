/**
 * Created by pposel on 08/05/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Icon, Popup, Button, Message, Confirm} from 'semantic-ui-react';
import VisibilityIcon from '../VisibilityIcon';
import consts from '../../utils/consts';
import _ from 'lodash';

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

    constructor(props, context){
        super(props, context);
        this.state = {
            openConfirm: false,
            visibility: null
        }
    }

    /**
     * @property {string} visibility resource visibility - in ['private', 'tenant, 'global']
     * @property {func} [onSetVisibility(visibility)] function to be called when user confirm changing visibility
     * @property {array} [allowedSettingTo=['tenant']] array of visibilities the item is allowed to change to
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        visibility: PropTypes.oneOf([
            consts.visibility.PRIVATE.name,
            consts.visibility.TENANT.name,
            consts.visibility.GLOBAL.name]).isRequired,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        className: PropTypes.string
    };

    static defaultProps = {
        className: '',
    };

    render() {
        let setTenantAllowed = _.includes(this.props.allowedSettingTo, consts.visibility.TENANT.name) && _.isEqual(this.props.visibility, consts.visibility.PRIVATE.name);
        let setGlobalAllowed = _.includes(this.props.allowedSettingTo, consts.visibility.GLOBAL.name) && !_.isEqual(this.props.visibility, consts.visibility.GLOBAL.name);
        let canChangeVisibility = setGlobalAllowed || setTenantAllowed;
        let icon = <VisibilityIcon visibility={this.props.visibility}
                                     className={this.props.className}
                                     link={setGlobalAllowed}
                                     onClick={e => e.stopPropagation()}
                                     bordered
                                     disabled={!canChangeVisibility}/>;

        let closePopup = ()=>{};
        let popupContent =
        <div className="setVisibility">
            <Message warning content="This operation cannot be reverted"/>
            {
                setTenantAllowed
                &&
                <Button animated color="green" onClick={() => {
                    closePopup();
                    this.setState({openConfirm: true, visibility: consts.visibility.TENANT.name})
                }}>
                    <Button.Content visible>Tenant</Button.Content>
                    <Button.Content hidden><Icon name="user" /></Button.Content>
                </Button>
            }
            {
                setGlobalAllowed
                &&
                <Button animated color="blue" onClick={() => {
                    closePopup();
                    this.setState({openConfirm: true, visibility: consts.visibility.GLOBAL.name})
                }}>
                    <Button.Content visible>Global</Button.Content>
                    <Button.Content hidden><Icon name="globe"/></Button.Content>
                </Button>
            }
        </div>;

        let popup = <Popup wide trigger={icon} on='click' header="Change resource visibility" content={popupContent}
                           ref={(popup) => {
                               closePopup = () => {
                                   popup.setState({closed: true});
                                   setTimeout(()=>{
                                       popup.setState({closed: false});
                                   }, 0);
                               }}}/>;

        return (
            canChangeVisibility
                ?
                <span>
                    {popup}
                    {
                        (setTenantAllowed || setGlobalAllowed)
                        &&
                        <Confirm
                            className="setVisibilityModal"
                            content={`Are you sure you want to change resource visibility to ${this.state.visibility}?`}
                            open={this.state.openConfirm}
                            onCancel={() => this.setState({openConfirm: false, visibility: null})}
                            onConfirm={() => {
                                this.props.onSetVisibility(this.state.visibility);
                                this.setState({openConfirm: false, visibility: null});
                            }}
                        />
                    }
                </span>
                :
                icon
        )
    }
}

