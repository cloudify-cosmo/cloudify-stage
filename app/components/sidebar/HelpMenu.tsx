import _ from 'lodash';
import React, { FunctionComponent } from 'react';

import { useSelector } from 'react-redux';
import { Icon } from '../basic';
import type { ReduxState } from '../../reducers';
import SideBarItem from './SideBarItem';
import StageUtils from '../../utils/stageUtils';
import AboutModal from '../AboutModal';
import { useBoolean, useToggle } from '../../utils/hooks';
import SideBarItemIcon from './SideBarItemIcon';

const t = StageUtils.getT('users');
const tHelp = StageUtils.getT('help');

interface HelpMenuProps {
    onAboutModalOpen: () => void;
}

const HelpMenu: FunctionComponent<HelpMenuProps> = ({ onAboutModalOpen }) => {
    const [aboutModalVisible, showAboutModal, closeAboutModal] = useBoolean();
    const [expanded, toggleExpand] = useToggle();

    const currentVersion = useSelector((state: ReduxState) => state.manager.version.version);
    const version = _.includes(currentVersion, 'dev') ? 'latest' : currentVersion;

    const { redirectToPage } = StageUtils.Url;

    function handleModalOpen() {
        onAboutModalOpen();
        showAboutModal();
    }

    return (
        <>
            <SideBarItem onClick={toggleExpand}>
                <SideBarItemIcon name="help circle" />
                {t('help')}
                <Icon
                    name="dropdown"
                    rotated={expanded ? undefined : 'counterclockwise'}
                    style={{ position: 'absolute', right: 12, margin: 0 }}
                />
            </SideBarItem>

            {expanded && (
                <>
                    <SideBarItem subItem onClick={() => redirectToPage(tHelp('documentationLink', { version }))}>
                        <SideBarItemIcon name="book" />
                        {tHelp('documentation')}
                    </SideBarItem>
                    <SideBarItem subItem onClick={() => redirectToPage(tHelp('contactLink'))}>
                        <SideBarItemIcon name="comments" />
                        {tHelp('contact')}
                    </SideBarItem>
                    <SideBarItem subItem onClick={handleModalOpen}>
                        <SideBarItemIcon name="info circle" />
                        {tHelp('about')}
                    </SideBarItem>
                </>
            )}

            <AboutModal open={aboutModalVisible} onHide={closeAboutModal} />
        </>
    );
};

export default HelpMenu;
