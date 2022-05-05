import React from 'react';
import { size } from 'lodash';
import type { LabelProps } from 'semantic-ui-react';

import { Label } from '../../basic';

const ItemsCount: React.FunctionComponent<{ items: any[]; color?: LabelProps['color'] }> = ({
    items,
    color = 'blue'
}) => {
    const itemsCount = size(items);
    return (
        <Label color={itemsCount > 0 ? color : undefined} horizontal>
            {itemsCount}
        </Label>
    );
};

export default ItemsCount;
