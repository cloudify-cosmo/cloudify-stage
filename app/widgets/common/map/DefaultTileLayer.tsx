import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import Consts from '../Consts';

const DefaultTileLayer: FunctionComponent = () => {
    const { urlTemplate } = Consts.leaflet;
    const url = useMemo(() => Stage.Utils.Url.url(urlTemplate), [urlTemplate]);

    const attribution = ReactRedux.useSelector(
        (state: Stage.Types.ReduxState): string => state.config.app.maps.attribution
    );

    return <Stage.Basic.Leaflet.TileLayer attribution={attribution} url={url} />;
};
export default DefaultTileLayer;
