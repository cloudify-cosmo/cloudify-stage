// @ts-nocheck File not migrated fully to TS

export default function MyResourcesCheckbox({ toolbox }) {
    function handleChange(proxy, elm) {
        toolbox.getContext().setValue('onlyMyResources', elm.checked);
        toolbox.getEventBus().trigger('plugins:refresh');
        toolbox.getEventBus().trigger('snapshots:refresh');
        toolbox.getEventBus().trigger('blueprints:refresh');
        toolbox.getEventBus().trigger('deployments:refresh');
        toolbox.getEventBus().trigger('filters:refresh');
    }

    const { Checkbox } = Stage.Basic;
    return <Checkbox toggle label="Show only my resources" onChange={handleChange} />;
}

MyResourcesCheckbox.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
