export const db = {};

export function mockDb(dbToSet: Record<string, () => Promise<any>>) {
    Object.assign(db, dbToSet);
}
