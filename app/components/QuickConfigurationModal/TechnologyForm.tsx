import { useState } from 'react';
import TechnologyButton from './TechnologyButton';

const TechnologyButton = () => {
    const [localData, setLocalData] = useState();
    return (
        <div>
            {schema.map(itemSchema => {
                const itemData = localData[itemSchema.name];
                return (
                    <div key={itemSchema.name}>
                        <TechnologyButton
                            name={itemSchema.name}
                            logo={itemSchema.logo}
                            label={itemSchema.label}
                            value={!!itemData}
                            on
                        />
                    </div>
                );
            })}
        </div>
    );
};