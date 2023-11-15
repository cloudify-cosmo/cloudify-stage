import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { tDrillDownButtons } from './common';
import { isTopLevelPage } from '../../common';
import DrilldownButton from './DrilldownButton';
import { Icon } from '../../../../../components/basic';
import StageUtils from '../../../../../utils/stageUtils';

interface ParentButtonProps {
    toolbox: Stage.Types.Toolbox;
}

const translate = StageUtils.composeT(tDrillDownButtons, 'parent');

const ParentButton: FunctionComponent<ParentButtonProps> = ({ toolbox }) => {
    const drilldownContext = ReactRedux.useSelector((state: Stage.Types.ReduxState) => state.drilldownContext);
    const showParentButton = useMemo(() => !isTopLevelPage(drilldownContext), [drilldownContext]);

    return showParentButton ? (
        <DrilldownButton onClick={() => toolbox.goToParentPage()} title={translate('title')}>
            <Icon name="angle left" />
            {translate('label')}
        </DrilldownButton>
    ) : null;
};
export default ParentButton;
