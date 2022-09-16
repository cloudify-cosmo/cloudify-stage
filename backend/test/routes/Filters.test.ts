import request from 'supertest';
import app from 'app';
import mockDb from '../mockDb';

jest.mock('db/Connection');
jest.mock('handler/ManagerHandler');

describe('/filters endpoint', () => {
    const filterId = 'filterId';
    const pageName = 'Page1';
    const widgetName = 'Deployments View 1';
    const tabWidgetName = 'Deployments View 2';
    const username = 'test_user';

    function createWidgets(deploymentsViewWidgetName: string) {
        return [
            {
                definition: 'deploymentsView',
                name: deploymentsViewWidgetName,
                configuration: { filterId }
            }
        ];
    }

    mockDb({
        UserApps: {
            findAll: () =>
                Promise.resolve([
                    {
                        appData: {
                            pages: [
                                {
                                    name: pageName,
                                    layout: [
                                        {
                                            type: 'widgets',
                                            content: createWidgets(widgetName)
                                        },
                                        {
                                            type: 'tabs',
                                            content: [
                                                {
                                                    widgets: createWidgets(tabWidgetName)
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        username
                    }
                ])
        }
    });

    it('returns filter usage data', () => {
        return request(app)
            .get(`/console/filters/usage/${filterId}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual([
                    { pageName, widgetName, username },
                    { pageName, widgetName: tabWidgetName, username }
                ]);
            });
    });

    it('returns empty array for unused filter', () => {
        return request(app)
            .get(`/console/filters/usage/unused_filter`)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual([]);
            });
    });
});
