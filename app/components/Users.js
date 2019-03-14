/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import EventBus from '../utils/EventBus';
import {Dropdown, Icon} from './basic';

export default class Users extends Component {

    static propTypes = {
        manager: PropTypes.object.isRequired,
        showAllOptions: PropTypes.bool.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        canEditMode: PropTypes.bool.isRequired,
        canTemplateManagement: PropTypes.bool.isRequired,
        canLicenseManagement: PropTypes.bool.isRequired,
        onEditModeChange: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired,
        onReset: PropTypes.func,
        onTemplates: PropTypes.func,
        onLicense: PropTypes.func
    };

    componentDidMount() {
        EventBus.on('menu.users:logout',this.props.onLogout,this);
    }

    onEditModeClick() {
        this.props.onEditModeChange(!this.props.isEditMode);
    }

    render() {

        const userMenuTrigger = (
            <span>
                <Icon name='user' size="small" circular/>
                <span>{this.props.manager.username}</span>
            </span>
        );

        let dropdownItems = [];
        dropdownItems.push();
        dropdownItems.push();
        dropdownItems.push();

        return (
                <Dropdown item pointing='top right' trigger={userMenuTrigger} className='usersMenu' >
                    <Dropdown.Menu>
                        {
                            this.props.showAllOptions && this.props.canEditMode &&
                            <Dropdown.Item icon='configure' selected={this.props.isEditMode} active={this.props.isEditMode}
                                           text={this.props.isEditMode ? 'Exit Edit Mode' : 'Edit Mode'} id='editModeMenuItem'
                                           value='editMode' onClick={this.onEditModeClick.bind(this)}/>
                        }

                        {
                            this.props.showAllOptions && this.props.canTemplateManagement &&
                            <Dropdown.Item icon='list layout' text='Template Management' value='templates' title='Template management'
                                           onClick={this.props.onTemplates} id='templatesMenuItem'/>
                        }

                        <Dropdown.Item key='reset'id='resetMenuItem'
                                       icon='undo' text='Reset Templates' value='reset'
                                       title='Reset application screens'
                                       onClick={this.props.onReset} />

                        {
                            this.props.showAllOptions && this.props.canLicenseManagement &&
                            <Dropdown.Item key='license' id='licenseMenuItem'
                                           icon='key' text='License Management' value='license'
                                           onClick={this.props.onLicense} />
                        }

                        <Dropdown.Divider key='log-out-divider'/>

                        <Dropdown.Item key='log-out' id='logoutMenuItem'
                                       icon='log out' text='Logout' value='logout'
                                       onClick={this.props.onLogout}/>
                    </Dropdown.Menu>
                </Dropdown>
        );
    }
}
