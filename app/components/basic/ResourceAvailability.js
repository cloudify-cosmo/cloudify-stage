/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Icon, Popup, Button, Message, Confirm} from 'semantic-ui-react';

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
 * <ResourceAvailability availability={ResourceAvailability.PRIVATE} />
 * <ResourceAvailability availability={ResourceAvailability.TENANT} />
 * <ResourceAvailability availability={ResourceAvailability.GLOBAL} />
 *```
 */
export default class ResourceAvailability extends Component {

    /**
     *
     */
    static PRIVATE = 'private';

    /**
     *
     */
    static TENANT = 'tenant';

    /**
     *
     */
    static GLOBAL = 'global';

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
            ResourceAvailability.PRIVATE,
            ResourceAvailability.TENANT,
            ResourceAvailability.GLOBAL]).isRequired,
        onSetAvailability: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        className: PropTypes.string
    };

    static defaultProps = {
        className: '',
    };

    render() {
        const ICON_PROP = {
            [ResourceAvailability.PRIVATE]: {name: 'lock', color: 'red', title: 'Private resource'},
            [ResourceAvailability.TENANT]: {name: 'user', color: 'green', title: 'Tenant resource'},
            [ResourceAvailability.GLOBAL]: {name: 'globe', color: 'blue', title: 'Global resource'}
        };
        let setTenantAllowed = _.includes(this.props.allowedSettingTo, ResourceAvailability.TENANT) && _.isEqual(this.props.availability, ResourceAvailability.PRIVATE);
        let setGlobalAllowed = _.includes(this.props.allowedSettingTo, ResourceAvailability.GLOBAL) && !_.isEqual(this.props.availability, ResourceAvailability.GLOBAL);
        let canChangeAvailability = setGlobalAllowed || setTenantAllowed;
        let icon = <Icon name={ICON_PROP[this.props.availability].name}
                         color={ICON_PROP[this.props.availability].color}
                         title={ICON_PROP[this.props.availability].title}
                         className={this.props.className} link={setGlobalAllowed}
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
                <Button animated color={ICON_PROP[ResourceAvailability.TENANT].color} onClick={() => {
                    closePopup();
                    this.setState({openConfirm: true, availability: ResourceAvailability.TENANT})
                }}>
                    <Button.Content visible>Tenant</Button.Content>
                    <Button.Content hidden><Icon name={ICON_PROP[ResourceAvailability.TENANT].name} /></Button.Content>
                </Button>
            }
            {
                setGlobalAllowed
                &&
                <Button animated color={ICON_PROP[ResourceAvailability.GLOBAL].color} onClick={() => {
                    closePopup();
                    this.setState({openConfirm: true, availability: ResourceAvailability.GLOBAL})
                }}>
                    <Button.Content visible>Global</Button.Content>
                    <Button.Content hidden><Icon name={ICON_PROP[ResourceAvailability.GLOBAL].name}/></Button.Content>
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

