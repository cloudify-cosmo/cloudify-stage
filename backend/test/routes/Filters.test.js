const request = require('supertest');
const mockDb = require('../mocks/mockDb');
require('../mocks/passport');

describe('/filters endpoint', () => {
    const filterId = 'filterId';
    const pageName = 'Page1';
    const widgetName = 'Deployments View 1';
    const tabWidgetName = 'Deployments View 2';
    const username = 'test_user';

    function createWidgets(deploymentsViewWidgetName) {
        return [
            {
                definition: 'deploymentsView',
                name: deploymentsViewWidgetName,
                configuration: { filterId }
            }
        ];
    }

    mockDb({
        UserApp: {
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
    const app = require('app');

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
