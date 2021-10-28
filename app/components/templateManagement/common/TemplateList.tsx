import React, { FunctionComponent } from 'react';
import ItemsList, { ItemsListProps } from './ItemsList';

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
