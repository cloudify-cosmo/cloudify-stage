import _ from 'lodash';
import type { CSSProperties, FunctionComponent } from 'react';
import React from 'react';
import { Divider, Icon, List, Message, PopupConfirm, Segment } from '../../basic';
import StageUtils from '../../../utils/stageUtils';
import type { PageMenuItem } from './types';

const translate = StageUtils.getT('templates.templateManagement.pageMenuItemsList');

interface PageMenuItemsListProps {
    custom: boolean;
    onDelete: (item: PageMenuItem) => void;
    pages: PageMenuItem[];
    style: CSSProperties;
}

const PageMenuItemsList: FunctionComponent<PageMenuItemsListProps> = ({ custom, onDelete, pages, style }) => {
    return (
        <Segment style={style}>
            <Icon name="bars" /> {translate('header')}
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {pages.map(item => {
                    const { id } = item;
                    return (
                        <List.Item key={id}>
                            {id}

                            {custom && _.size(pages) > 1 && (
                                <PopupConfirm
                                    trigger={
                                        <Icon
                                            link
                                            name="remove"
                                            className="right floated"
                                            onClick={(e: Event) => e.stopPropagation()}
                                        />
                                    }
                                    content={translate('removeConfirm')}
                                    onConfirm={() => onDelete(item)}
                                    onCancel={undefined}
                                    onCanConfirm={undefined}
                                    defaultOpen={undefined}
                                />
                            )}
                        </List.Item>
                    );
                })}

                {_.isEmpty(pages) && <Message content={translate('noItems')} />}
            </List>
        </Segment>
    );
};

export default PageMenuItemsList;
