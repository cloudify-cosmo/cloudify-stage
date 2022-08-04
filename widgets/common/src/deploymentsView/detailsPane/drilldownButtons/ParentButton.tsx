import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import { tDrillDownButtons } from './common';
import { isTopLevelPage } from '../../common';
import DrilldownButton from './DrilldownButton';

interface ParentButtonProps {
    toolbox: Stage.Types.Toolbox;
}

const { Icon } = Stage.Basic;
const t = Stage.Utils.composeT(tDrillDownButtons, 'parent');

const ParentButton: FunctionComponent<ParentButtonProps> = ({ toolbox }) => {
    const drilldownContext = ReactRedux.useSelector((state: Stage.Types.ReduxState) => state.drilldownContext);
    const showParentButton = useMemo(() => !isTopLevelPage(drilldownContext), [drilldownContext]);

    return showParentButton ? (
        <DrilldownButton onClick={() => toolbox.goToParentPage()} title={t('title')}>
            <Icon name="angle left" />
            {t('label')}
        </DrilldownButton>
    ) : null;
};
export default ParentButton;
