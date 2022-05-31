import type { FunctionComponent } from 'react';
import type { CheckboxProps } from 'semantic-ui-react';

interface MyResourcesCheckboxProps {
    toolbox: Stage.Types.Toolbox;
}

const MyResourcesCheckbox: FunctionComponent<MyResourcesCheckboxProps> = ({ toolbox }) => {
    const handleChange: CheckboxProps['onChange'] = (_proxy, element) => {
        toolbox.getContext().setValue('onlyMyResources', element.checked);
        toolbox.getEventBus().trigger('plugins:refresh');
        toolbox.getEventBus().trigger('snapshots:refresh');
        toolbox.getEventBus().trigger('blueprints:refresh');
        toolbox.getEventBus().trigger('deployments:refresh');
        toolbox.getEventBus().trigger('filters:refresh');
    };

    const { Checkbox } = Stage.Basic;
    return <Checkbox toggle label="Show only my resources" onChange={handleChange} />;
};

export default MyResourcesCheckbox;
