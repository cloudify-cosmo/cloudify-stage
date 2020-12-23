/* eslint-disable import/no-dynamic-require */
const _ = require('lodash');
const widgetBackend = require('widgets/executions/src/backend.js');

function getDataFor(test) {
    const referencesDirectory = './references';

    return {
        tasksGraph: require(`${referencesDirectory}/${test}_tasks-graph.json`),
        operations: require(`${referencesDirectory}/${test}_operations.json`),
        elkGraph: require(`${referencesDirectory}/${test}_elk-graph.json`)
    };
}

function getRegisterArguments() {
    let name = '';
    let method = '';
    let middleware = () => {};

    const register = (arg1, arg2, arg3) => {
        name = arg1;
        method = arg2;
        middleware = arg3;
    };
    widgetBackend({ register });

    return { name, method, middleware };
}

function getElkGraph(middleware, taskGraphResponse, operationsResponse) {
    return new Promise(resolve =>
        middleware(
            { query: '', headers: {} },
            {
                send: data => {
                    resolve(data);
                }
            },
            () => {},
            {
                Logger: () => console,
                Manager: {
                    doGet: url => {
                        if (url === '/tasks_graphs') {
                            return Promise.resolve(taskGraphResponse);
                        }
                        if (url === '/operations') {
                            return Promise.resolve(operationsResponse);
                        }
                        throw new Error(`Unexpected Manager.doGet call. URL: ${url}`);
                    }
                }
            }
        )
    );
}

describe('Executions widget backend', () => {
    const tests = ['root-level-task'];
    const { name, method, middleware } = getRegisterArguments();

    it('is using dedicated service', () => {
        expect(name).toBe('get_tasks_graph');
        expect(method).toBe('GET');
    });

    tests.forEach(test => {
        const testCaseName = _.lowerCase(test);
        const { tasksGraph, operations, elkGraph } = getDataFor(test);
        it(`is providing valid layout for ${testCaseName}`, () => {
            return getElkGraph(middleware, tasksGraph, operations).then(response =>
                expect(response).toStrictEqual(elkGraph)
            );
        });
    });
});
