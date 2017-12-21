/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Icon, Popup, Button, Message, Confirm} from 'semantic-ui-react';
import AvailabilityIcon from '../AvailabilityIcon';
import consts from '../../utils/consts';
import _ from 'lodash';

/**
 * ResourceAvailability - an icon representing resource availability. If allowed setting different availability than current,
 * clicking the icon will show a popup with the availability options. To approve the availability change a confirm modal is shown.
 *
 * ## Access
 * `Stage.Basic.ResourceAvailability`
 *
 * ## Usage
 *
 * ### ResourceAvailability (show)
 *
 * ![ResourceAvailability](manual/asset/resourceAvailability/ResourceAvailability_0.png)
 * ```
 * <ResourceAvailability availability={consts.availability.PRIVATE.name} />
 * <ResourceAvailability availability={consts.availability.TENANT.name} />
 * <ResourceAvailability availability={consts.availability.GLOBAL.name} />
 *```
 */
export default class ResourceAvailability extends Component {

    constructor(props, context){
        super(props, context);
        this.state = {
            openConfirm: false,
            availability: null
        }
    }

    /**
     * @property {string} availability resource availability - in ['private', 'tenant, 'global']
     * @property {func} [onSetAvailability(availability)] function to be called when user confirm changing availability
     * @property {array} [allowedSettingTo=['tenant']] array of availabilities the item is allowed to change to
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        availability: PropTypes.oneOf([
            consts.availability.PRIVATE.name,
            consts.availability.TENANT.name,
            consts.availability.GLOBAL.name]).isRequired,
        onSetAvailability: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        className: PropTypes.string
    };

    static defaultProps = {
        className: '',
    };

    render() {
        let setTenantAllowed = _.includes(this.props.allowedSettingTo, consts.availability.TENANT.name) && _.isEqual(this.props.availability, consts.availability.PRIVATE.name);
        let setGlobalAllowed = _.includes(this.props.allowedSettingTo, consts.availability.GLOBAL.name) && !_.isEqual(this.props.availability, consts.availability.GLOBAL.name);
        let canChangeAvailability = setGlobalAllowed || setTenantAllowed;
        let icon = <AvailabilityIcon availability={this.props.availability}
                                     className={this.props.className}
                                     link={setGlobalAllowed}
                                     onClick={e => e.stopPropagation()}
                                     bordered
                                     disabled={!canChangeAvailability}/>;

        let closePopup = ()=>{};
        let popupContent =
        <div className="setAvailability">
            <Message warning content="This operation cannot be reverted"/>
            {
                setTenantAllowed
                &&
                <Button animated color="green" onClick={() => {
                    closePopup();
                    this.setState({openConfirm: true, availability: consts.availability.TENANT.name})
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
                    this.setState({openConfirm: true, availability: consts.availability.GLOBAL.name})
                }}>
                    <Button.Content visible>Global</Button.Content>
                    <Button.Content hidden><Icon name="globe"/></Button.Content>
                </Button>
            }
        </div>;

        let popup = <Popup wide trigger={icon} on='click' header="Change resource availability" content={popupContent}
                           ref={(popup) => {
                               closePopup = () => {
                                   popup.setState({closed: true});
                                   setTimeout(()=>{
                                       popup.setState({closed: false});
                                   }, 0);
                               }}}/>;

        return (
            canChangeAvailability
                ?
                <span>
                    {popup}
                    {
                        (setTenantAllowed || setGlobalAllowed)
                        &&
                        <Confirm
                            className="setAvailabilityModal"
                            content={`Are you sure you want to change resource availability to ${this.state.availability}?`}
                            open={this.state.openConfirm}
                            onCancel={() => this.setState({openConfirm: false, availability: null})}
                            onConfirm={() => {
                                this.props.onSetAvailability(this.state.availability);
                                this.setState({openConfirm: false, availability: null});
                            }}
                        />
                    }
                </span>
                :
                icon
        )
    }
}

