// eslint-disable-next-line import/prefer-default-export
/* eslint-disable camelcase */

export namespace ExecutionsStatusWidget {
    export type Configuration = {
        pollingTime: number;
    };
    export interface Params {
        blueprint_id: Stage.ContextEntries['blueprintId'];
        deployment_id: Stage.ContextEntries['deploymentId'] | undefined;
        id: Stage.ContextEntries['executionId'];
        status_display: Stage.ContextEntries['executionStatus'];
    }

    interface DataItem {
        executions: number;
        status_display: string;
    }

    export interface Data {
        items: DataItem[];
    }
}
