import type { FunctionComponent } from 'react';
import React from 'react';
import type { ItemsListProps } from './ItemsList';
import ItemsList from './ItemsList';

interface TemplateListProps {
    templates: string[];
    noDataMessageKey: string;
    width?: ItemsListProps['width'];
}

const TemplateList: FunctionComponent<TemplateListProps> = ({ noDataMessageKey, templates = [], width }) => (
    <ItemsList
        icon="list layout"
        items={templates}
        noDataMessageI18nKey={noDataMessageKey}
        titleI18nKey="usedByTemplates"
        width={width}
    />
);

export default TemplateList;
