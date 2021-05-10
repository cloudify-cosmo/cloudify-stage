import type { ComponentProps, FunctionComponent } from 'react';

const { Popup } = Stage.Basic;

interface LabelsErrorPopupProps {
    content: ComponentProps<typeof Popup>['content'];
}

const LabelsErrorPopup: FunctionComponent<LabelsErrorPopupProps> = ({ content }) => {
    return <Popup open trigger={<div />} content={content} position="top left" pinned wide />;
};
export default LabelsErrorPopup;
