import { isEmpty } from 'lodash';
import React, { CSSProperties, FunctionComponent } from 'react';
import { IconProps } from 'semantic-ui-react';
import { Divider, Icon, List, Message, Segment } from '../../basic';
import StageUtils from '../../../utils/stageUtils';

const t = StageUtils.getT('templates');

export interface ReadOnlyListProps {
    items: string[];
    noDataMessageKey?: string;
    titleKey: string;
    icon: IconProps['name'];
    width?: CSSProperties['width'];
}

const ReadOnlyList: FunctionComponent<ReadOnlyListProps> = ({
    icon,
    noDataMessageKey,
    titleKey,
    items = [],
    width
}) => {
    return (
        <Segment style={{ width }}>
            <Icon name={icon} /> {t(titleKey)}
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {items.map(item => {
                    return <List.Item key={item}>{item}</List.Item>;
                })}
                {noDataMessageKey && isEmpty(items) && <Message content={t(noDataMessageKey)} />}
            </List>
        </Segment>
    );
};

export default ReadOnlyList;
