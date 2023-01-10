import Consts from '../../../utils/consts';

export type MarkerIconColor = 'blue' | 'green' | 'grey' | 'red' | 'yellow';

export function createMarkerIcon(color: MarkerIconColor) {
    return new window.L.Icon({
        iconUrl: `${Consts.CONTEXT_PATH}/static/images/marker-icon-${color}.png`,
        shadowUrl: `${Consts.CONTEXT_PATH}/static/images/marker-shadow.png`,
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
}
