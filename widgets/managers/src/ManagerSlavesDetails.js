/**
 * Created by jakub.niezgoda on 26/10/2018.
 */

import PropTypes from 'prop-types';
import ManagerStatusIcon from './ManagerStatusIcon';

export default class ManagerSlavesDetails extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
        }
    }

    static propTypes = {
        slaves: PropTypes.array
    };

    static defaultProps = {
        slaves: []
    };

    render() {
        let {Divider, Icon, Message, Segment, Table} = Stage.Basic;

        return (
            <Segment>
                <Icon name="disk"/> Slaves
                <Divider/>

                {
                    _.isEmpty(this.props.slaves)
                    ?
                        <Message content="No slaves available"/>
                    :
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Host IP</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    _.map(this.props.slaves, (slave) =>
                                        <Table.Row key={slave.ip}>
                                            <Table.Cell>
                                                {_.get(slave.status, 'name', '')}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {_.get(slave.status, 'host_ip', '')}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <ManagerStatusIcon status={slave.status} />
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                }
            </Segment>
        );
    }
};
