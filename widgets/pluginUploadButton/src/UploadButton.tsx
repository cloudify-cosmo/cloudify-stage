import type { FunctionComponent } from 'react';

const { Button } = Stage.Basic;
const { useBoolean } = Stage.Hooks;
const { UploadModal } = Stage.Common.Plugins;

interface UploadButtonProps {
    toolbox: Stage.Types.Toolbox;
}

const UploadButton: FunctionComponent<UploadButtonProps> = ({ toolbox }) => {
    const [isModalOpen, showModal, hideModal] = useBoolean();

    return (
        <div>
            <Button
                color="yellow"
                icon="upload"
                content="Upload Plugin"
                labelPosition="left"
                className="widgetButton"
                onClick={showModal}
            />

            <UploadModal open={isModalOpen} onHide={hideModal} toolbox={toolbox} />
        </div>
    );
};

export default UploadButton;
