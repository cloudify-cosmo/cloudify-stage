module.exports = function mockDb(db) {
    jest.doMock('../../db/Connection', () => {
        return {
            db
        };
    });
};
