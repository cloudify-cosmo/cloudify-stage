/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class Users extends Component {

    static propTypes = {
        manager: PropTypes.object.isRequired,
        showAllOptions: PropTypes.bool.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        onEditModeChange: PropTypes.func.isRequired,
        onConfigure: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired
    };

    onEditModeClick() {
        this.props.onEditModeChange(!this.props.isEditMode);
    }

    render() {
        let {Dropdown, Icon} = Stage.Basic;

        const userMenuTrigger = (
            <span>
                {this.props.manager.username}
                <Icon name='user' />
            </span>
        )

        return (
            <Dropdown pointing icon="dropdown" trigger={userMenuTrigger} className='usersMenu'>
                {
                    this.props.showAllOptions
                    ?
                    <Dropdown.Menu>
                        <Dropdown.Item icon='settings' text='Configure' value='configure'
                                       onClick={this.props.onConfigure}/>
                        <Dropdown.Item icon='configure' selected={this.props.isEditMode} active={this.props.isEditMode}
                                       text={this.props.isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
                                       value='editMode' onClick={this.onEditModeClick.bind(this)}/>
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
