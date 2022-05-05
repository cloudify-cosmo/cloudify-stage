import type { FunctionComponent } from 'react';
import type { Label } from './types';
import { sortLabels } from './common';

const newLabelColor = 'blue';
const labelLinesVisibleWithoutScroll = 6;
const maxListHeight = `${labelLinesVisibleWithoutScroll * 2 + 0.2}em`;

interface LabelsListProps {
    labels: Label[];
    onChange: (labels: Label[]) => void;
}

const LabelsList: FunctionComponent<LabelsListProps> = ({ labels, onChange }) => {
    const { Label: LabelComponent, Icon } = Stage.Basic;
    const sortedLabels = sortLabels(labels);

    return (
        <div
            className="ui multiple dropdown"
            style={{
                paddingRight: '4.1em',
                minHeight: '2em',
                maxHeight: maxListHeight,
                overflow: 'auto',
                maxWidth: '100%'
            }}
        >
            {sortedLabels.map(({ key, value, isInSystem = true }) => {
                return (
                    <LabelComponent
                        key={`${key}:${value}`}
                        as="a"
                        color={isInSystem ? undefined : newLabelColor}
                        onClick={event => event.stopPropagation()}
                    >
                        {key} <span style={{ fontWeight: 'lighter' }}>{value}</span>
                        <Icon
                            name="delete"
                            onClick={() => onChange(_.differenceBy(labels, [{ key, value }], { key, value }))}
                        />
                    </LabelComponent>
                );
            })}
        </div>
    );
};
export default LabelsList;
