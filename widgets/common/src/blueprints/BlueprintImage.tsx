import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

export interface BlueprintImageProps {
    url: string;
    width: number;
}

const { Image } = Stage.Basic;
const { ProductLogo } = Stage.Shared;
const { useBoolean } = Stage.Hooks;

const BlueprintImage: FunctionComponent<BlueprintImageProps> = ({ url, width }) => {
    const [defaultImage, showDefaultImage, showBlueprintImage] = useBoolean(false);

    useEffect(() => {
        showBlueprintImage();
    }, [url]);

    return defaultImage ? (
        <ProductLogo background="light" style={{ margin: 0, width, height: width }} />
    ) : (
        <Image src={url} inline onError={showDefaultImage} width={width} height="auto" />
    );
};

export default BlueprintImage;
