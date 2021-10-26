import React, { FunctionComponent } from 'react';
import ReadOnlyList, { ReadOnlyListProps } from './ReadOnlyList';

interface TemplateListProps {
    templates: string[];
    noDataMessageKey: string;
    width?: ReadOnlyListProps['width'];
}

const TemplateList: FunctionComponent<TemplateListProps> = ({ noDataMessageKey, templates = [], width }) => (
    <ReadOnlyList
        icon="list layout"
        items={templates}
        noDataMessageKey={noDataMessageKey}
        titleKey="usedByTemplates"
        width={width}
    />
);

export default TemplateList;
