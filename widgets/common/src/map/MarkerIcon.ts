export type MarkerIconColor = 'blue' | 'green' | 'grey' | 'red' | 'yellow';

export function createMarkerIcon(color: MarkerIconColor) {
    const widgetId = 'common';

    return new window.L.Icon({
        iconUrl: Stage.Utils.Url.widgetResourceUrl(widgetId, `/images/marker-icon-${color}.png`, false),
        shadowUrl: Stage.Utils.Url.widgetResourceUrl(widgetId, '/images/marker-shadow.png', false),
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
}
