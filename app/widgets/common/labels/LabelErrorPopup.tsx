import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';

interface LabelsErrorPopupProps {
    content: ComponentProps<typeof Stage.Basic.Popup>['content'];
}

const LabelsErrorPopup: FunctionComponent<LabelsErrorPopupProps> = ({ content }) => {
    const { Popup } = Stage.Basic;
    return <Popup open trigger={<div />} content={content} position="top left" pinned wide />;
};
export default LabelsErrorPopup;
