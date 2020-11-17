/**
 * Created by Alex on 29/06/2017.
 */
const { Button } = Stage.Basic;

Stage.defineWidget({
    id: 'composerLink',
    name: 'Composer link',
    description: 'Opens Blueprint Composer in a different tab',
    initialWidth: 2,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('composerLink'),
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render() {
        return (
            <Button
                labelPosition="left"
                color="blue"
                className="widgetButton"
                icon="external"
                onClick={() => {
                    window.open('/composer', '_blank');
                }}
                content="Blueprint Composer"
            />
        );
    }
});
