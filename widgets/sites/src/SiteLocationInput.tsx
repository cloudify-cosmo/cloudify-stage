import type { Field } from 'app/widgets/common/types';
import { useState, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import SiteLocationMap from './SiteLocationMap';

export interface SiteLocationInputProps {
    value?: string;
    toolbox: Stage.Types.Toolbox;
    onChange: (event: SyntheticEvent | null, field: Omit<Field, 'type' | 'checked'>) => void;
}

export default function SiteLocationInput({ value = '', onChange, toolbox }: SiteLocationInputProps) {
    const [mapOpen, setMapOpen] = useState(false);
    const [enteredValue, setEnteredValue] = useState(value || '');

    useEffect(() => setEnteredValue(value), [value]);

    function onLocationChange(changedLocation: string) {
        setEnteredValue(changedLocation);
        onChange(null, { name: 'siteLocation', value: changedLocation });
    }

    const { Button, Form } = Stage.Basic;

    return (
        <>
            <Form.Input
                label="Location"
                value={enteredValue}
                placeholder="latitude, longitude (32.166369, 34.810893)"
                onChange={(_event, data) => onLocationChange(data.value)}
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
