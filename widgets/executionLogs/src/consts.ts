export const widgetId = 'executionLogs';

export const translate = Stage.Utils.getT(`widgets.${widgetId}`);

export const basePageSize = 50;

export const commonIncludeKeys = [
    '_storage_id',
    'execution_id',
    'message',
    'error_causes',
    'reported_timestamp',
    'type'
] as const;
