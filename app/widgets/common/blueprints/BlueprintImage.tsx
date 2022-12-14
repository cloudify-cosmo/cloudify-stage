import type { FunctionComponent } from 'react';
import React, { useEffect } from 'react';
import { useBoolean } from '../../../utils/hooks';
import { ProductLogo } from '../../../components/shared';
import { Image } from '../../../components/basic';

export interface BlueprintImageProps {
    url: string;
    width: number;
}

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
