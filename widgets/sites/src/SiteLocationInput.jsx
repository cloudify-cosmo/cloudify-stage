import SiteLocationMap from './SiteLocationMap';

export default function SiteLocationInput({ value, onChange, toolbox }) {
    const { useState, useEffect } = React;

    const [mapOpen, setMapOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState(value || '');

    useEffect(() => setEnteredValue(value), [value]);

    function onLocationChange(newValue) {
        setEnteredValue(newValue);
        onChange(null, { name: 'siteLocation', value: newValue });
    }

    const { Button, Form } = Stage.Basic;

    return (
        <>
            <Form.Input
                label="Location"
                value={enteredValue}
                placeholder="latitude, longitude (32.166369, 34.810893)"
                onChange={(e, data) => onLocationChange(data.value)}
                action={<Button active={mapOpen} icon="crosshairs" onClick={() => setMapOpen(!mapOpen)} />}
            />
            {mapOpen && (
                <SiteLocationMap
                    location={enteredValue}
                    mapOptions={{
                        onClick: e => onLocationChange(`${e.latlng.lat}, ${e.latlng.lng}`),
                        style: { height: 'calc(100vh - 344px)', maxHeight: 460, marginTop: -14, cursor: 'pointer' }
                    }}
                    toolbox={toolbox}
                />
            )}
        </>
    );
}

SiteLocationInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

SiteLocationInput.defaultProps = {
    value: null
};
