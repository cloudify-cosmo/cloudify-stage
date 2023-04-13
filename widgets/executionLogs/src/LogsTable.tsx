import { isEmpty } from 'lodash';
import LogMessage from './LogMessage';
import type { Event, ExecutionLogsData } from './types';

interface LogsTableProps {
    data: ExecutionLogsData;
}
export default function LogsTable({ data }: LogsTableProps) {
    const { Icon, Table } = Stage.Basic;
    const { ErrorCausesModal, Utils } = Stage.Common.Events;
    const { Json, Time } = Stage.Utils;
    const { useResettableState } = Stage.Hooks;
    const [event, setEvent, resetEvent] = useResettableState<Event | undefined>(undefined);

    return (
        <>
            <Table basic color="black" compact inverted>
                <Table.Body>
                    {data.items.map(item => {
                        const messageText = Json.stringify(item.message, false);

                        const isErrorLog = Utils.isError(item);

                        const hasErrorCauses = !isEmpty(item.error_causes);
                        const timestamp = Time.formatTimestamp(
                            item.reported_timestamp,
                            'DD-MM-YYYY HH:mm:ss.SSS',
                            moment.ISO_8601
                        );

                        return (
                            // eslint-disable-next-line no-underscore-dangle
                            <Table.Row key={item._storage_id} error={isErrorLog} verticalAlign="top">
                                <Table.Cell collapsing>{timestamp}</Table.Cell>
                                <Table.Cell colspan={hasErrorCauses ? 1 : 2}>
                                    <LogMessage message={messageText} />
                                </Table.Cell>
                                {hasErrorCauses && (
                                    <Table.Cell collapsing>
                                        <Icon name="zoom" link onClick={() => setEvent(item)} />
                                    </Table.Cell>
                                )}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            {event && <ErrorCausesModal event={event} onClose={resetEvent} />}
        </>
    );
}
