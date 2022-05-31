import type { FunctionComponent } from 'react';

const { Button } = Stage.Basic;
const { useBoolean } = Stage.Hooks;
const { UploadModal } = Stage.Common.Blueprints;

interface UploadButtonProps {
    toolbox: Stage.Types.Toolbox;
}

const UploadButton: FunctionComponent<UploadButtonProps> = ({ toolbox }: UploadButtonProps) => {
    const [isModalOpen, showModal, hideModal] = useBoolean(false);

    return (
        <div>
            <Button
                color="blue"
                icon="upload"
                content="Upload Blueprint"
                labelPosition="left"
                className="widgetButton"
                onClick={showModal}
            />

            <UploadModal open={isModalOpen} onHide={hideModal} toolbox={toolbox} />
        </div>
    );
};

export default UploadButton;
