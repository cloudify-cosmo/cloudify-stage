import React, { FunctionComponent, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { HeaderBar } from 'cloudify-ui-components';
import i18n from 'i18next';

import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CancelButton, Divider, Header, Modal } from './basic';
import Banner from './banner/Banner';
import CurrentLicense from './license/CurrentLicense';
import CurrentVersion from './license/CurrentVersion';
import EulaLink from './license/EulaLink';
import stageUtils from '../utils/stageUtils';
import Consts from '../utils/consts';
import { ReduxState } from '../reducers';

interface AboutModalProps {
    open: boolean;
    onHide: () => void;
}

const AboutModal: FunctionComponent<AboutModalProps> = ({ onHide, open }) => {
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();

    const canLicenseManagement = useSelector(
        (state: ReduxState) =>
            state.manager.license.isRequired &&
            stageUtils.isUserAuthorized(Consts.permissions.LICENSE_UPLOAD, state.manager)
    );
    const version = useSelector((state: ReduxState) => state.manager.version);
    const license = useSelector((state: ReduxState) => state.manager.license.data);

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header style={{ padding: 0, backgroundColor: theme.mainColor }}>
                <HeaderBar className={undefined}>
                    <Banner hideOnSmallScreen={false} />
                </HeaderBar>
            </Modal.Header>

            <Modal.Content>
                <Header>{i18n.t('help.aboutModal.versionDetails', 'Version Details')}</Header>
                <Divider />
                <CurrentVersion version={version} />

                <Header>{i18n.t('help.aboutModal.licenseDetails', 'License Details')}</Header>
                <Divider />
                <CurrentLicense license={license} />

                <EulaLink />
            </Modal.Content>

            <Modal.Actions>
                {canLicenseManagement && (
                    <Button
                        content={i18n.t('help.aboutModal.licenseManagement', 'License Management')}
                        icon="key"
                        color="yellow"
                        onClick={() => dispatch(push(Consts.LICENSE_PAGE_PATH))}
                    />
                )}
                <CancelButton content={i18n.t('help.aboutModal.close', 'Close')} onClick={onHide} />
            </Modal.Actions>
        </Modal>
    );
};

export default AboutModal;
