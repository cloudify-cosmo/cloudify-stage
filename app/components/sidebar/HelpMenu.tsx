import _ from 'lodash';
import React, { FunctionComponent } from 'react';

import { useSelector } from 'react-redux';
import { Dropdown } from '../basic';
import type { ReduxState } from '../../reducers';
import IconSelection from '../IconSelection';
import SideBarItem from './SideBarItem';
import StageUtils from '../../utils/stageUtils';
import AboutModal from '../AboutModal';
import { useBoolean } from '../../utils/hooks';

const t = StageUtils.getT('users');
const tHelp = StageUtils.getT('help');

const HelpMenu: FunctionComponent = () => {
    const [aboutModalVisible, showAboutModal, closeAboutModal] = useBoolean();

    const currentVersion = useSelector((state: ReduxState) => state.manager.version.version);
    const version = _.includes(currentVersion, 'dev') ? 'latest' : currentVersion;

    const menuTrigger = (
        <SideBarItem>
            <IconSelection enabled={false} value="help circle" />
            {t('help')}
        </SideBarItem>
    );

    const { redirectToPage } = StageUtils.Url;

    return (
        <>
            <Dropdown trigger={menuTrigger} pointing="left" icon={null} fluid>
                <Dropdown.Menu style={{ margin: 0 }}>
                    <Dropdown.Item
                        icon="book"
                        text={tHelp('documentation')}
                        onClick={() => redirectToPage(tHelp('documentationLink', { version }))}
                    />
                    <Dropdown.Item
                        icon="comments"
                        text={tHelp('contact')}
                        onClick={() => redirectToPage(tHelp('contactLink'))}
                    />
                    <Dropdown.Divider />

                    <Dropdown.Item icon="info circle" text={tHelp('about')} onClick={showAboutModal} />
                </Dropdown.Menu>
            </Dropdown>

            <AboutModal open={aboutModalVisible} onHide={closeAboutModal} />
        </>
    );
};

export default HelpMenu;
