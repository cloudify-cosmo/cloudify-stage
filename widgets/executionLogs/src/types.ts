import type { PaginatedResponse } from 'backend/types';
import type { CloudifyEventPart, CloudifyLogEventPart, FullEventData } from 'app/widgets/common/events';
import type { commonIncludeKeys } from './consts';

export type Event = Pick<FullEventData, typeof commonIncludeKeys[number]> & (CloudifyEventPart | CloudifyLogEventPart);

export type ExecutionLogsData = PaginatedResponse<Event>;
