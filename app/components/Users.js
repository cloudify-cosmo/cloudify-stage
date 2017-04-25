/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React, { Component, PropTypes } from 'react';
import Consts from '../utils/consts';

export default class Users extends Component {

    static propTypes = {
        manager: PropTypes.object.isRequired,
        showAllOptions: PropTypes.bool.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        canEditTheUi: PropTypes.bool.isRequired,
        onEditModeChange: PropTypes.func.isRequired,
        onConfigure: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired,
        onMaintenance: PropTypes.func,
        onReset: PropTypes.func.isRequired
    };

    onEditModeClick() {
        this.props.onEditModeChange(!this.props.isEditMode);
    }

    render() {
        let {Dropdown, Icon} = Stage.Basic;

        const userMenuTrigger = (
            <span>
                <Icon name='user' size="small" circular/>
                {this.props.manager.username}
            </span>
        );

        var adminElements = [];
        if (this.props.showAllOptions && this.props.manager.auth.role === Consts.ROLE_ADMIN) {
            adminElements.push(<Dropdown.Item   key='maintenance'
                                                icon='doctor' text='Maintenance Mode' value='maintenance'
                                                onClick={this.props.onMaintenance}/>);
            adminElements.push(<Dropdown.Divider key='divider'/>);
            adminElements.push(<Dropdown.Item    key='configure' icon='options' text='Configure' value='configure'
                                                 onClick={this.props.onConfigure}/>);
        }

        return (
                <Dropdown item trigger={userMenuTrigger} className='usersMenu' scrolling>
                    {
                        this.props.showAllOptions
                        ?
                        <Dropdown.Menu>
                            {adminElements}
                            <Dropdown.Item icon='undo' text='Reset' value='reset' title='Reset application screens'
                                           onClick={this.props.onReset}/>

                            {
                                this.props.canEditTheUi &&
                                <Dropdown.Item icon='configure' selected={this.props.isEditMode} active={this.props.isEditMode}
                                               text={this.props.isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
                                               value='editMode' onClick={this.onEditModeClick.bind(this)}/>
                            }
                            <Dropdown.Divider />
                            <Dropdown.Item icon='log out' text='Logout' value='logout'
                                           onClick={this.props.onLogout}/>
                        </Dropdown.Menu>
                        :
                        <Dropdown.Menu>
                            <Dropdown.Item icon='log out' text='Logout' value='logout'
                                           onClick={this.props.onLogout}/>
                        </Dropdown.Menu>
                    }
                </Dropdown>
        );
    }
}
