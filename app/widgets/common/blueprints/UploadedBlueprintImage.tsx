import type { FunctionComponent } from 'react';
import React from 'react';
import BlueprintImage from './BlueprintImage';
import StageUtils from '../../../utils/stageUtils';

export interface UploadedBlueprintProps {
    tenantName: string;
    blueprintId: string;
    width: number;
}

const UploadedBlueprintImage: FunctionComponent<UploadedBlueprintProps> = ({ tenantName, blueprintId, width }) => {
    return <BlueprintImage url={StageUtils.Url.url(`/ba/image/${tenantName}/${blueprintId}`)} width={width} />;
};

export default UploadedBlueprintImage;
