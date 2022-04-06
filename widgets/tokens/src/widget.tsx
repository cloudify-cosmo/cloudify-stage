Stage.defineWidget<any, any, any>({
    id: 'tokens',
    name: 'Tokens',
    initialWidth: 12,
    initialHeight: 16,
    isReact: true,
    hasReadme: true,
    fetchUrl: '[manager]/tokens[params]',
    permission: Stage.GenericConfig.WIDGET_PERMISSION('tokens'),

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(10)],

    render(_widget, _data, _error, _toolbox) {
        return <div>I'm alive!</div>;
    }
});

export {};
