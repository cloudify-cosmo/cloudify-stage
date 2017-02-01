/**
 * Created by pposel on 30/01/2017.
 */

export default class UserDetails extends React.Component {

    render() {
        let {Segment, List, Icon, Message, Divider} = Stage.Basic;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users"/> Groups

                    {
                        !_.isEmpty(this.props.data.groups)
                        &&
                        <div>
                            <Divider/>
                            <List bulleted={this.props.data.groups.length > 1} verticalAlign='middle'>
                                {
                                    this.props.data.groups.map((item) => {
                                        return (
                                            <List.Item key={item}>{item}</List.Item>
                                        );
                                    })
                                }
                            </List>
                        </div>
                    }
                    {
                        _.isEmpty(this.props.data.groups)
                        &&
                        <Message content="No groups available"/>
                    }
                </Segment>
                <Segment>
                    <Icon name="user"/> Tenants

                    {
                        !_.isEmpty(this.props.data.tenants)
                        &&
                        <div>
                            <Divider/>
                            <List bulleted={this.props.data.tenants.length > 1} verticalAlign='middle'>
                                {
                                    this.props.data.tenants.map((item) => {
                                        return (
                                            <List.Item key={item}>{item}</List.Item>
                                        );
                                    })
                                }
                            </List>
                        </div>
                    }
                    {
                        _.isEmpty(this.props.data.tenants)
                        &&
                        <Message content="No tenants available"/>
                    }
                </Segment>
            </Segment.Group>
        );
    }
};
