import styled from 'styled-components';
import type { TerraformDetailsModalProps } from './TerraformDetailsModal';
import TerraformDetailsModal from './TerraformDetailsModal';

export const topologyContainerId = 'topologyContainer';

const ScrollGlass = styled.div<{ locked: boolean }>`
    position: absolute;
    left: 10px;
    top: 10px;
    bottom: 10px;
    right: 10px;

    z-index: ${({ locked }) => (locked ? 9 : 0)};

    span {
        display: none;
        position: absolute;
        top: 50%;
        font-size: 30px;
        text-align: center;
        width: 100%;
        color: white;
    }

    &:hover {
        background-color: black;
        opacity: 0.1;
    }
    &:hover span {
        display: block;
    }
`;

const TopologyContainer = styled.div`
    position: absolute;
    left: 10px;
    right: 10px;
    top: 10px;
    bottom: 10px;
`;

const SaveConfirmationPopup = styled(Stage.Basic.Popup)`
    left: unset;
    right: 65px;
`;

const translateTopology = Stage.Utils.getT('widgets.topology');

export default function TopologyView({
    terraformDetails,
    onTerraformDetailsModalClose,
    saveConfirmationOpen
}: {
    terraformDetails: TerraformDetailsModalProps['terraformDetails'];
    onTerraformDetailsModalClose: TerraformDetailsModalProps['onClose'];
    saveConfirmationOpen: boolean;
}) {
    const [isMouseOver, setMouseOver, unsetMouseOver] = Stage.Hooks.useBoolean();
    const [locked, lock, unlock] = Stage.Hooks.useBoolean(true);

    const releaseScroller = () => {
        setMouseOver();
        unlock();
    };

    const timerReleaseScroller = () => {
        setMouseOver();
        setTimeout(() => {
            if (isMouseOver) {
                releaseScroller();
            }
        }, 3000);
    };

    const reactivateScroller = () => {
        unsetMouseOver();
        lock();
    };

    return (
        <div
            role="none"
            onClick={releaseScroller}
            onKeyPress={releaseScroller}
            onMouseEnter={timerReleaseScroller}
            onMouseLeave={reactivateScroller}
        >
            <ScrollGlass locked={locked}>
                <span>{translateTopology('scrollerMessage')}</span>
            </ScrollGlass>
            <SaveConfirmationPopup
                open={saveConfirmationOpen}
                content={translateTopology('layoutSaveConfirmation')}
                position="top center"
                trigger={<TopologyContainer id={topologyContainerId} />}
            />
            <TerraformDetailsModal terraformDetails={terraformDetails} onClose={onTerraformDetailsModalClose} />
        </div>
    );
}
