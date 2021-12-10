// eslint-disable-next-line import/prefer-default-export
export namespace ExecutionsStatusWidget {
    export type configuration = Record<string, never>;
    export interface params {
        /* eslint-disable camelcase */
        blueprint_id: Stage.ContextEntries['blueprintId'];
        deployment_id: Stage.ContextEntries['deploymentId'] | undefined;
        id: Stage.ContextEntries['executionId'];
        status_display: Stage.ContextEntries['executionStatus'];
        /* eslint-enable camelcase */
    }
    export type data = any;
}
