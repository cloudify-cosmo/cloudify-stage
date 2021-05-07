// eslint-disable-next-line import/prefer-default-export
export function getGroupIdForBatchAction() {
    return `BATCH_ACTION_${new Date().toISOString()}`;
}
