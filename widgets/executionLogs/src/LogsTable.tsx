import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import LogMessage from './LogMessage';
import type { Event, ExecutionLogsData } from './types';
import { basePageSize, translate } from './consts';

interface LogsTableProps {
    items: ExecutionLogsData['items'];
    executionId: string;
    moreItemsAvailable: boolean;
    pageSize: number;
    toolbox: Stage.Types.Toolbox;
}
export default function LogsTable({ items, executionId, moreItemsAvailable, pageSize, toolbox }: LogsTableProps) {
    const { Button, Icon, Table } = Stage.Basic;
    const { ErrorCausesModal, Utils } = Stage.Common.Events;
    const { Json } = Stage.Utils;
    const { useResettableState } = Stage.Hooks;
    const [event, setEvent, resetEvent] = useResettableState<Event | undefined>(undefined);

    const setPageSize = (size: number) => toolbox.refresh({ gridParams: { pageSize: size } });
    const showMoreLogs = () => setPageSize(pageSize + basePageSize);

    useEffect(() => {
        setPageSize(basePageSize);
    }, [executionId]);

    return (
        <>
            <Table basic color="black" compact inverted>
                {!moreItemsAvailable && (
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colspan={3} textAlign="center">
                                <Button
                                    basic
                                    compact
                                    content={translate('buttons.showMoreLogs')}
                                    inverted
                                    onClick={showMoreLogs}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                )}
                <Table.Body>
                    {items.map(item => {
                        const messageText = Json.stringify(item.message, false);
                        const isErrorLog = Utils.isError(item);
                        const hasErrorCauses = !isEmpty(item.error_causes);
                        const timestamp = Utils.getFormattedTimestamp(item);

                        return (
                            <Table.Row
                                // eslint-disable-next-line no-underscore-dangle
                                key={`${item._storage_id} + ${item.reported_timestamp}`}
                                error={isErrorLog}
                                verticalAlign="top"
                            >
                                <Table.Cell collapsing>{timestamp}</Table.Cell>
                                <Table.Cell colSpan={hasErrorCauses ? 1 : 2}>
                                    <LogMessage message={messageText} />
                                </Table.Cell>
                                {hasErrorCauses && (
                                    <Table.Cell collapsing>
                                        <Icon
                                            title={translate('buttons.showErrorCauses')}
                                            name="zoom"
                                            link
                                            onClick={() => setEvent(item)}
                                        />
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
