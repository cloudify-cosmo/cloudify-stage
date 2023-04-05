import { isEmpty } from 'lodash';
import type { PaginatedResponse } from 'backend/types';
import LogMessage from './LogMessage';
import type { Event } from './widget';
// import DetailsModal from '../../events/src/DetailsModal';
import DetailsIcon from '../../events/src/DetailsIcon';

interface LogsTableProps {
    data: PaginatedResponse<Event>;
}
export default function LogsTable({ data }: LogsTableProps) {
    const { Table } = Stage.Basic;
    const { Json } = Stage.Utils;

    return (
        <Table basic color="black" compact inverted>
            <Table.Body>
                {data.items.map(item => {
                    const messageText = Json.stringify(item.message, false);
                    const isErrorLog = Stage.Common.EventUtils.isError(item.type, item.event_type, item.level);
                    const showErrorCauses = !isEmpty(item.error_causes);
                    const timestamp = Stage.Utils.Time.formatTimestamp(
                        item.reported_timestamp,
                        'DD-MM-YYYY HH:mm:ss.SSS',
                        moment.ISO_8601
                    );

                    return (
                        // eslint-disable-next-line no-underscore-dangle
                        <Table.Row key={item._storage_id} error={isErrorLog}>
                            <Table.Cell collapsing>{timestamp}</Table.Cell>
                            <Table.Cell>
                                <LogMessage>{messageText}</LogMessage>
                            </Table.Cell>
                            <Table.Cell collapsing>{showErrorCauses && <DetailsIcon onClick={_.noop} />}</Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
}
