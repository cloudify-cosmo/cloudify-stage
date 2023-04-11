import type { FunctionComponent } from 'react';
import { translateSecrets } from './widget.utils';

interface SecretValueProps {
    canShowSecret: boolean;
    showSecretLoading: boolean;
    showSecretKey: string;
    showSecretValue: string;
    secretKey: string;
    onHide: () => void;
    onShow: () => void;
    toolbox: Stage.Types.Toolbox;
}

const SecretValue: FunctionComponent<SecretValueProps> = ({
    canShowSecret,
    showSecretKey,
    showSecretValue,
    showSecretLoading,
    secretKey,
    onHide,
    onShow,
    toolbox
}) => {
    const { Icon, Popup } = Stage.Basic;

    const currentUsername = toolbox.getManager().getCurrentUsername();
    const selectedTenant = toolbox.getManager().getSelectedTenant();

    const popupMessage = translateSecrets('popupMessage', {
        currentUsername,
        secretKey,
        selectedTenant
    });

    if (showSecretKey === secretKey) {
        if (showSecretLoading) {
            return <Icon name="spinner" loading />;
        }
        if (canShowSecret) {
            return (
                <div>
                    <Icon link name="hide" title={translateSecrets('icons.hide')} onClick={onHide} />
                    <pre className="forceMaxWidth">{showSecretValue}</pre>
                </div>
            );
        }

        return (
            <Popup position="top right" on="hover">
                <Popup.Trigger>
                    <Icon name="dont" color="red" />
                </Popup.Trigger>
                {popupMessage}
            </Popup>
        );
    }
    return <Icon link name="unhide" title={translateSecrets('icons.show')} onClick={onShow} />;
};

export default SecretValue;
