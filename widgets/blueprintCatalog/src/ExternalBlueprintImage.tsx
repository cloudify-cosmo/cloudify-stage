import type { FunctionComponent } from 'react';

export interface ExternalBlueprintImageProps {
    url: string;
    width: number;
}

const { Blueprints } = Stage.Common;

const ExternalBlueprintImage: FunctionComponent<ExternalBlueprintImageProps> = ({ url, width }) => {
    return <Blueprints.Image url={Stage.Utils.Url.url(`/external/content?url=${encodeURIComponent(url)}`)} width={width} />
};

export default ExternalBlueprintImage;
