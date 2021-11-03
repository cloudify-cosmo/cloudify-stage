import React, { CSSProperties, FunctionComponent } from 'react';
import { SemanticICONS } from 'semantic-ui-react';
import { ApproveButton, CancelButton, Divider, Icon, Popup } from '../basic';
import { SemanticIconDropdown } from '../shared';
import { useInput, useOpen } from '../../utils/hooks';

interface IconSelectionProps {
    style: CSSProperties;
    value?: SemanticICONS;
    onChange: (value?: SemanticICONS) => void;
}

const IconSelection: FunctionComponent<IconSelectionProps> = ({ value, style, onChange }) => {
    const [currentValue, setCurrentValue, resetCurrentValue] = useInput(value);
    const [opened, open, close] = useOpen(resetCurrentValue);

    function handleSubmit() {
        close();
        onChange(currentValue);
    }

    return (
        <Popup
            open={opened}
            onClick={(e: Event) => e.stopPropagation()}
            trigger={
                <Icon
                    name={value ?? 'expand'}
                    style={style}
                    onClick={(e: Event) => {
                        e.stopPropagation();
                        open();
                    }}
                />
            }
        >
            <div style={{ width: '23em', textAlign: 'right' }}>
                <SemanticIconDropdown fluid onChange={setCurrentValue} value={currentValue ?? ''} />
                <Divider hidden />
                <CancelButton onClick={close} />
                <ApproveButton onClick={handleSubmit} style={{ marginRight: 0 }} />
            </div>
        </Popup>
    );
};

export default IconSelection;
