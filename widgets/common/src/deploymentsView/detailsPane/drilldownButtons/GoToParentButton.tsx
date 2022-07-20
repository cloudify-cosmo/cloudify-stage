import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import { tDrillDownButtons } from './common';
import { isTopLevelPage } from '../../common';
import DrilldownButton from './DrilldownButton';

interface GoToParentButtonProps {
    toolbox: Stage.Types.Toolbox;
}

const { Icon } = Stage.Basic;
const tParentButton = Stage.Utils.composeT(tDrillDownButtons, 'parent');

const GoToParentButton: FunctionComponent<GoToParentButtonProps> = ({ toolbox }) => {
    const drilldownContext = ReactRedux.useSelector((state: Stage.Types.ReduxState) => state.drilldownContext);
    const shouldShowParentButton = useMemo(() => !isTopLevelPage(drilldownContext), [drilldownContext]);

    return shouldShowParentButton ? (
        <DrilldownButton onClick={() => toolbox.goToParentPage()} title={tParentButton('title')}>
            <Icon name="angle left" />
            {tParentButton('label')}
        </DrilldownButton>
    ) : null;
};
export default GoToParentButton;
