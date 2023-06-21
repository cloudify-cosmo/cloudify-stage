import _, { noop } from 'lodash';
import type { CSSProperties, FunctionComponent } from 'react';
import React from 'react';
import type { IconProps } from 'semantic-ui-react';
import { Divider, Icon, List, Message, PopupConfirm, Segment } from '../../basic';
import StageUtils from '../../../utils/stageUtils';

const translate = StageUtils.getT('templates');

export interface ItemsListProps {
    removable?: boolean;
    onDelete?: (item: string) => void;
    items: string[];
    icon: IconProps['name'];
    width?: CSSProperties['width'];

    noDataMessageI18nKey?: string;
    titleI18nKey: string;
    deleteConfirmI18nKey?: string;
}

const ItemsList: FunctionComponent<ItemsListProps> = ({
    removable,
    onDelete = noop,
    items = [],
    icon,
    width,
    titleI18nKey,
    noDataMessageI18nKey,
    deleteConfirmI18nKey = ''
}) => {
    return (
        <Segment style={{ width }}>
            <Icon name={icon} /> {translate(titleI18nKey)}
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {items.map(item => {
                    return (
                        <List.Item key={item}>
                            {item}

                            {removable && _.size(items) > 1 && (
                                <PopupConfirm
                                    trigger={
                                        <Icon
                                            link
                                            name="remove"
                                            className="right floated"
                                            onClick={(e: Event) => e.stopPropagation()}
                                        />
                                    }
                                    content={translate(deleteConfirmI18nKey)}
                                    onConfirm={() => onDelete(item)}
                                    onCancel={undefined}
                                    onCanConfirm={undefined}
                                    defaultOpen={undefined}
                                />
                            )}
                        </List.Item>
                    );
                })}

                {noDataMessageI18nKey && _.isEmpty(items) && <Message content={translate(noDataMessageI18nKey)} />}
            </List>
        </Segment>
    );
};

export default ItemsList;
