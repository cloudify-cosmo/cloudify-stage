import type { StageAPI } from '../utils/StageAPI';

declare global {
    export const Stage: StageAPI;

    interface Window {
        Stage: StageAPI;
    }
}
