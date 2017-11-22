/**
 * Created by pposel on 30/01/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class UserDetails extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            processing: false,
            processItem: ''
        }
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        onError: PropTypes.func
    };

    _removeTenant(tenant) {
        this.setState({processItem: tenant, processing: true});

        var actions = new Actions(this.props.toolbox);
        actions.doRemoveFromTenant(this.props.data.username, tenant).then(()=>{
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('tenants:refresh');
            this.setState({processItem: '', processing: false});
        }).catch((err)=>{
            this.props.onError(err.message);
            this.setState({processItem: '', processing: false});
        });
    }

    _removeGroup(group) {
        this.setState({processItem: group, processing: true});

        var actions = new Actions(this.props.toolbox);
        actions.doRemoveFromGroup(this.props.data.username, group).then(()=>{
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('userGroups:refresh');
            this.setState({processItem: '', processing: false});
        }).catch((err)=>{
            this.props.onError(err.message);
            this.setState({processItem: '', processing: false});
        });
    }

    render() {
        let {Segment, List, Icon, Message, Divider} = Stage.Basic;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users"/> Groups
                    <Divider/>
                    <List divided relaxed verticalAlign='middle' className="light">
                        {
                            this.props.data.groups.map((item) => {
                                let processing = this.state.processing && this.state.processItem === item;

                                return (
                                    <List.Item key={item}>
                                        {item}
                                        <Icon link name={processing?'notched circle':'remove'} loading={processing}
                                              className="right floated" onClick={this._removeGroup.bind(this, item)}/>
                                    </List.Item>
                                );
                            })
                        }

                        {_.isEmpty(this.props.data.groups) && <Message content="No groups available"/>}
                    </List>
                </Segment>
                <Segment>
                    <Icon name="user"/> Tenants
                    <Divider/>
                    <List divided relaxed verticalAlign='middle' className="light">
                        {
                            _.map(_.keys(this.props.data.tenants), (item) => {
                                let processing = this.state.processing && this.state.processItem === item;

                                return (
                                    <List.Item key={item}>
                                        {item}
                                        <Icon link name={processing?'notched circle':'remove'} loading={processing}
                                              className="right floated" onClick={this._removeTenant.bind(this, item)}/>
                                    </List.Item>
                                );
                            })
                        }

                        {_.isEmpty(this.props.data.tenants) && <Message content="No tenants available"/>}
                    </List>
                </Segment>
            </Segment.Group>
        );
    }
};
