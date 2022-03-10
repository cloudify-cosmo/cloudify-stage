import type { FunctionComponent } from 'react';
import PopupContent from './PopupContent';

const InputsHelpIcon: FunctionComponent = () => {
    const { Button, Popup } = Stage.Basic;
    return (
        <Popup
            flowing
            trigger={<Button icon="help" floated="right" />}
            header="Value type"
            content={<PopupContent />}
        />
    );
};

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { InputsHelpIcon };
    }
}

Stage.defineCommon({
    name: 'InputsHelpIcon',
    common: InputsHelpIcon
});
