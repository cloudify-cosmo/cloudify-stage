import type { FunctionComponent } from 'react';
import BlueprintImage from "./BlueprintImage";

export interface UploadedBlueprintProps {
    tenantName: string;
    blueprintId: string;
    width: number;
}

const UploadedBlueprintImage: FunctionComponent<UploadedBlueprintProps> = ({ tenantName, blueprintId, width }) => {
    return <BlueprintImage url={Stage.Utils.Url.url(`/ba/image/${tenantName}/${blueprintId}`)} width={width} />
};

export default UploadedBlueprintImage;
