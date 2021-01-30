import type { StageAPI } from '../utils/StageAPI';

declare global {
    // eslint-disable-next-line import/prefer-default-export
    export const Stage: StageAPI;

    interface Window {
        Stage: StageAPI;
    }
}
