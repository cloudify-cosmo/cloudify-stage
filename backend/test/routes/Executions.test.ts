/* eslint-disable import/no-dynamic-require */
import manager from 'handler/services/ManagerService';
import request from 'supertest';
import app from '../../app';

jest.mock('handler/services/ManagerService');

function getTestData() {
    const referencesDirectory = './fixtures/executions';

    return {
        tasksGraph: require(`${referencesDirectory}/root-level-task_tasks-graph.json`),
        operations: require(`${referencesDirectory}/root-level-task_operations.json`),
        elkGraph: require(`${referencesDirectory}/root-level-task_elk-graph.json`)
    };
}

describe('/executions/graph endpoint', () => {
    it(`provides valid layout`, () => {
        const { tasksGraph, operations, elkGraph } = getTestData();

        (<jest.Mock>manager.doGet).mockResolvedValueOnce(tasksGraph).mockResolvedValueOnce(operations);

        return request(app)
            .get('/console/executions/graph')
            .then(response => {
                expect(response.type).toContain('json');
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(elkGraph);
                expect(manager.doGet).nthCalledWith(1, '/tasks_graphs', { headers: {}, params: {} });
                expect(manager.doGet).nthCalledWith(2, '/operations', {
                    headers: {},
                    params: { graph_id: 'be8e09c4eaa44e3ba4efd78abcc927db' }
                });
            });
    });
});
