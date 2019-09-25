function createMarkerIcon(color) {
    const widgetId = 'common';

    return new L.Icon({
        iconUrl: Stage.Utils.Url.widgetResourceUrl(widgetId, `/images/marker-icon-${color}.png`, false),
        shadowUrl: Stage.Utils.Url.widgetResourceUrl(widgetId, '/images/marker-shadow.png', false),
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
}

Stage.defineCommon({
    name: 'createMarkerIcon',
    common: createMarkerIcon
});
