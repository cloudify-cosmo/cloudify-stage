export interface Event {
    // eslint-disable-next-line camelcase
    error_causes: { message: string; traceback: string; type: string }[];
    message: any;
}
