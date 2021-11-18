import React, { CSSProperties, FunctionComponent } from 'react';
import { SemanticICONS } from 'semantic-ui-react';
import { ApproveButton, CancelButton, Divider, Icon, Popup } from './basic';
import { SemanticIconDropdown } from './shared';
import { useInput, useOpen } from '../utils/hooks';

interface IconSelectionProps {
    style?: CSSProperties;
    value?: SemanticICONS;
    onChange?: (value?: SemanticICONS) => void;
    enabled?: boolean;
}

const IconSelection: FunctionComponent<IconSelectionProps> = ({ value, style, onChange, enabled = true }) => {
    const [currentValue, setCurrentValue, resetCurrentValue] = useInput(value);
    const [opened, open, close] = useOpen(resetCurrentValue);

    function handleSubmit() {
        close();
        onChange!(currentValue || undefined);
    }

    return (
        <Popup
            open={opened}
            onClick={(e: Event) => e.stopPropagation()}
            trigger={
                <Icon
                    name={value ?? 'expand'}
                    style={{
                        marginLeft: -10,
                        marginRight: 4,
                        float: 'none',
                        ...style
                    }}
                    onClick={(e: Event) => {
                        if (enabled) {
                            e.stopPropagation();
                            open();
                        }
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
