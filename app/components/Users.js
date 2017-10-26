/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React, { Component, PropTypes } from 'react';
import EventBus from '../utils/EventBus';

export default class Users extends Component {

    static propTypes = {
        manager: PropTypes.object.isRequired,
        showAllOptions: PropTypes.bool.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        canEditMode: PropTypes.bool.isRequired,
        canMaintenanceMode: PropTypes.bool.isRequired,
        canConfigure: PropTypes.bool.isRequired,
        canTemplateManagement: PropTypes.bool.isRequired,
        onEditModeChange: PropTypes.func.isRequired,
        onConfigure: PropTypes.func,
        onLogout: PropTypes.func.isRequired,
        onMaintenance: PropTypes.func,
        onReset: PropTypes.func,
        onTemplates: PropTypes.func
    };

    componentDidMount() {
        EventBus.on('menu.users:logout',this.props.onLogout,this);
    }

    onEditModeClick() {
        this.props.onEditModeChange(!this.props.isEditMode);
    }

    render() {
        let {Dropdown, Icon} = Stage.Basic;

        const userMenuTrigger = (
            <span>
                <Icon name='user' size="small" circular/>
                <span>{this.props.manager.username}</span>
            </span>
        );

        var commonElements = [];
        commonElements.push(<Dropdown.Item key='reset'id='resetMenuItem'
                                           icon='undo' text='Reset' value='reset'
                                           title='Reset application screens'
                                           onClick={this.props.onReset} />);
        commonElements.push(<Dropdown.Divider key='log-out-divider'/>);
        commonElements.push(<Dropdown.Item key='log-out' id='logoutMenuItem'
                                           icon='log out' text='Logout' value='logout'
                                           onClick={this.props.onLogout}/>);

        return (
                <Dropdown item trigger={userMenuTrigger} className='usersMenu' scrolling>
                    {
                        this.props.showAllOptions
                        ?
                        <Dropdown.Menu>
                            {
                                this.props.canMaintenanceMode &&
                                    [
                                        <Dropdown.Item key='maintenance' id='maintenanceMenuItem' icon='doctor'
                                                       text='Maintenance Mode' value='maintenance' onClick={this.props.onMaintenance}/>,
                                        <Dropdown.Divider key='divider'/>
                                    ]
                            }
                            {/*Currently configure has no configurations, so hidding it*/}
                            {/*{*/}
                              {/*this.props.canConfigure &&*/}
                                  {/*<Dropdown.Item key='configure' id='configureMenuItem' icon='options' text='Configure'*/}
                                                 {/*value='configure' onClick={this.props.onConfigure}/>*/}
                            {/*}*/}
                            {
                                this.props.canEditMode &&
                                    <Dropdown.Item icon='configure' selected={this.props.isEditMode} active={this.props.isEditMode}
                                               text={this.props.isEditMode ? 'Exit Edit Mode' : 'Edit Mode'} id='editModeMenuItem'
                                               value='editMode' onClick={this.onEditModeClick.bind(this)}/>
                            }
                            {
                                this.props.canTemplateManagement &&
                                    <Dropdown.Item icon='list layout' text='Template management' value='templates' title='Template management'
                                               onClick={this.props.onTemplates} id='templatesMenuItem'/>
                            }
                            {commonElements}
                        </Dropdown.Menu>
                        :
                        <Dropdown.Menu>
                            {commonElements}
                        </Dropdown.Menu>
                    }
                </Dropdown>
        );
    }
}
