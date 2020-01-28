/**
 * Created by pawelposel on 13/02/2017.
 */

Stage.defineWidget({
    id: 'buttonLink',
    name: 'Button link',
    description: 'Opens provided URL in a different tab',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [
        { id: 'label', name: 'Button label', default: 'Button Link', type: Stage.Shared.GenericField.STRING },
        { id: 'url', name: 'URL address', default: '', type: Stage.Shared.GenericField.STRING }
    ],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('buttonLink'),

    render(widget, data, error, toolbox) {
        const { Button } = Stage.Basic;

        return (
            <Button
                className="labeled icon"
                color="green"
                fluid
                icon="external"
                disabled={!widget.configuration.url}
                onClick={() => {
                    window.open(widget.configuration.url, '_blank');
                }}
                content={widget.configuration.label}
            />
        );
    }
});
