import type { FunctionComponent } from 'react';

export interface BlueprintImageProps {
    tenantName: string;
    blueprintId: string;
    width: number;
}

const { Image } = Stage.Basic;
const { ProductLogo } = Stage.Shared;
const { useBoolean } = Stage.Hooks;

const BlueprintImage: FunctionComponent<BlueprintImageProps> = ({ tenantName, blueprintId, width }) => {
    const [defaultImage, showDefaultImage] = useBoolean(false);

    return defaultImage ? (
        <ProductLogo background="light" style={{ margin: 0, width, height: width }} />
    ) : (
        <Image
            src={Stage.Utils.Url.url(`/ba/image/${tenantName}/${blueprintId}`)}
            inline
            onError={showDefaultImage}
            width={width}
            height="auto"
        />
    );
};

export default BlueprintImage;
