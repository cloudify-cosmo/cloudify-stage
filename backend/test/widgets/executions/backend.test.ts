/* eslint-disable import/no-dynamic-require */
import _ from 'lodash';
import widgetBackend from '../../../../widgets/executions/src/backend';
import type { BackendServiceRegistrator, BackendService } from '../../../handler/BackendHandler.types';

function getDataFor(test: string) {
    const referencesDirectory = './references';

    return {
        tasksGraph: require(`${referencesDirectory}/${test}_tasks-graph.json`),
        operations: require(`${referencesDirectory}/${test}_operations.json`),
        elkGraph: require(`${referencesDirectory}/${test}_elk-graph.json`)
    };
}

type MiddlewareMock = (_req: any, _res: any, _next: any, _helper: any) => void;
function getRegisterArguments() {
    let name;
    let method;
    let middleware: BackendService | undefined;

    const register: BackendServiceRegistrator['register'] = (arg1, arg2, arg3) => {
        name = arg1;
        method = arg2;
        middleware = arg3;
    };
    widgetBackend({ register });

    return { name, method, middleware };
}

function getElkGraph(middleware: MiddlewareMock, taskGraphResponse: any, operationsResponse: any) {
    return new Promise(resolve =>
        middleware(
            { query: '', headers: {} },
            {
                send: (data: any) => {
                    resolve(data);
                }
            },
            () => {},
            {
                Logger: () => console,
                Manager: {
                    doGet: (url: string) => {
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
            return getElkGraph(middleware!, tasksGraph, operations).then(response =>
                expect(response).toStrictEqual(elkGraph)
            );
        });
    });
});
