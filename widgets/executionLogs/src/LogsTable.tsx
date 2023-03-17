import type { PaginatedResponse } from 'backend/types';
import type { Event } from './widget';
// import DetailsModal from '../../events/src/DetailsModal';
import DetailsIcon from '../../events/src/DetailsIcon';

interface LogsTableProps {
    data: PaginatedResponse<Event>;
}
export default function LogsTable({ data }: LogsTableProps) {
    const { Table, Icon, Popup } = Stage.Basic;
    const { EventUtils } = Stage.Common;
    const { Json } = Stage.Utils;
    const EmptySpace = () => <span>&nbsp;&nbsp;</span>;

    // TODO: Have dynamic length?
    const maxMessageLength = 200;

    return (
        <Table compact basic color="black">
            <Table.Body>
                {data.items.map(item => {
                    const isEventType = item.type === EventUtils.eventType;
                    const messageText = Json.stringify(item.message, false);
                    const showDetailsIcon = !_.isEmpty(item.error_causes) || messageText.length > maxMessageLength;

                    const eventOptions = isEventType
                        ? EventUtils.getEventTypeOptions(item.event_type)
                        : EventUtils.getLogLevelOptions(item.level);
                    const eventName =
                        eventOptions.text || _.capitalize(_.lowerCase(isEventType ? item.event_type : item.level));
                    const EventIcon = () => (
                        <span style={{ color: '#2c4b68', lineHeight: 1 }}>
                            {isEventType ? (
                                <i
                                    style={{ fontFamily: 'cloudify', fontSize: 26 }}
                                    className={`icon ${eventOptions.iconClass}`}
                                >
                                    {eventOptions.iconChar}
                                </i>
                            ) : (
                                <Icon
                                    name={eventOptions.icon}
                                    color={eventOptions.color}
                                    circular
                                    inverted
                                    className={eventOptions.class}
                                />
                            )}
                        </span>
                    );

                    return (
                        <Table.Row key={item.id}>
                            <Table.Cell className="alignCenter">
                                {!eventName ? (
                                    <EventIcon />
                                ) : (
                                    <Popup
                                        trigger={
                                            <span>
                                                <EventIcon />
                                            </span>
                                        }
                                        content={<span>{eventName}</span>}
                                    />
                                )}
                            </Table.Cell>
                            <Table.Cell className="alignCenter noWrap">{item.reported_timestamp}</Table.Cell>
                            <Table.Cell>
                                {item.message}
                                {showDetailsIcon && (
                                    <>
                                        <EmptySpace />
                                        <DetailsIcon onClick={_.noop} />
                                    </>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
}
