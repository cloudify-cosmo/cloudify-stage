import _ from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';

import { useSelector } from 'react-redux';
import type { ReduxState } from '../../reducers';
import SideBarItem from './SideBarItem';
import StageUtils from '../../utils/stageUtils';
import AboutModal from './AboutModal';
import { useBoolean } from '../../utils/hooks';
import type { SystemMenuGroupItemProps } from './SystemMenu';

const t = StageUtils.getT('users');
const tHelp = StageUtils.getT('help');

const HelpMenu: FunctionComponent<SystemMenuGroupItemProps> = ({ expanded, onModalOpen, onGroupClick }) => {
    const [aboutModalVisible, showAboutModal, closeAboutModal] = useBoolean();

    const currentVersion = useSelector((state: ReduxState) => state.manager.version.version);
    const version = _.includes(currentVersion, 'dev') ? 'latest' : currentVersion;

    const { redirectToPage } = StageUtils.Url;

    function handleModalOpen() {
        onModalOpen();
        showAboutModal();
    }

    return (
        <>
            <SideBarItem icon="help circle" label={t('help')} onClick={onGroupClick} expandable expanded={expanded} />

            {expanded && (
                <>
                    <SideBarItem
                        icon="book"
                        label={tHelp('documentation')}
                        subItem
                        onClick={() => redirectToPage(tHelp('documentationLink', { version }))}
                    />
                    <SideBarItem
                        icon="comments"
                        label={tHelp('contact')}
                        subItem
                        onClick={() => redirectToPage(tHelp('contactLink'))}
                    />
                    <SideBarItem icon="info circle" label={tHelp('about')} subItem onClick={handleModalOpen} />
                </>
            )}

            <AboutModal open={aboutModalVisible} onHide={closeAboutModal} />
        </>
    );
};

export default HelpMenu;
