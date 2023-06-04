import type { FunctionComponent } from 'react';
import React from 'react';
import _ from 'lodash';
import { Icon, List, Message } from '../../basic';
import StageUtils from '../../../utils/stageUtils';

const translate = StageUtils.getT('templates');

interface SelectionListProps {
    items: string[];
    onItemSelected: (item: string) => void;
    noDataMessageI18nKey: string;
    addIconTitleI18nKey: string;
}

const SelectionList: FunctionComponent<SelectionListProps> = ({
    items,
    addIconTitleI18nKey,
    noDataMessageI18nKey,
    onItemSelected
}) => {
    return (
        <List divided relaxed verticalAlign="middle" className="light">
            {items.map(item => {
                return (
                    <List.Item key={item}>
                        {item}

                        <Icon
                            link
                            name="add"
                            className="right floated"
                            onClick={() => onItemSelected(item)}
                            title={translate(addIconTitleI18nKey)}
                        />
                    </List.Item>
                );
            })}

            {_.isEmpty(items) && <Message content={translate(noDataMessageI18nKey)} />}
        </List>
    );
};

export default SelectionList;
