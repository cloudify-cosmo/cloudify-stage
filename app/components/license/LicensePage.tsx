import type { ChangeEvent } from 'react';
import React, { Component } from 'react';
import { HeaderBar } from 'cloudify-ui-components';
import type { ButtonProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import type { LicenseResponse } from 'backend/handler/AuthHandler.types';
import type { PaginatedResponse } from 'backend/types';
import type { LicenseStatus } from '../../reducers/managerReducer/licenseReducer';
import Banner from '../sidebar/banner/Banner';
import Consts from '../../utils/consts';
import StageUtils from '../../utils/stageUtils';
import { Button, FullScreenSegment, Grid, Header, Icon, Message, MessageContainer } from '../basic';
import CurrentLicense from './CurrentLicense';
import EulaLink from './EulaLink';
import UploadLicense from './UploadLicense';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import Manager from '../../utils/Manager';
import { setLicense } from '../../actions/manager/license';
import Auth from '../../utils/auth';
import type { ReduxThunkDispatch } from '../../configureStore';
import type { ReduxState } from '../../reducers';

interface LicenseSwitchButtonProps {
    color: ButtonProps['color'];
    isEditLicenseActive: boolean;
    onClick: ButtonProps['onClick'];
}
const t = StageUtils.getT('licenseManagement');

function LicenseSwitchButton({ color, isEditLicenseActive, onClick }: LicenseSwitchButtonProps) {
    return (
        <Button
            content={isEditLicenseActive ? t('showLicense') : t('editLicense')}
            floated="right"
            icon={isEditLicenseActive ? 'text file' : 'edit'}
            color={color}
            labelPosition="left"
            onClick={onClick}
        />
    );
}

interface DescriptionMessageProps {
    canUploadLicense: boolean;
    isTrial: boolean;
    isEditLicenseActive: boolean;
    status: LicenseStatus;
    onLicenseButtonClick: ButtonProps['onClick'];
}

const { redirectToPage } = StageUtils.Url;
const StyledMessageContent = styled(Message.Content)`
    &&&& {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
function DescriptionMessage({
    canUploadLicense,
    isTrial,
    isEditLicenseActive,
    onLicenseButtonClick,
    status
}: DescriptionMessageProps) {
    switch (status) {
        case Consts.LICENSE.EMPTY:
            return (
                <Message negative icon>
                    <Icon name="ban" />
                    <StyledMessageContent>
                        <div>
                            <Message.Header>{t('subheader.noLicense')}</Message.Header>
                            {canUploadLicense ? (
                                <span
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: t('action.canUpload.noLicense')
                                    }}
                                />
                            ) : (
                                <span>{t('action.cannotUpload.noLicense')}</span>
                            )}
                        </div>
                        <Button
                            content={t('getLicense')}
                            icon="external"
                            color="red"
                            labelPosition="right"
                            fluid={false}
                            onClick={() => redirectToPage(t('getLicenseLink'))}
                            style={{ minWidth: '160px' }}
                        />
                    </StyledMessageContent>
                </Message>
            );
        case Consts.LICENSE.EXPIRED:
            return isTrial ? (
                <Message negative icon>
                    <Icon name="clock outline" />
                    <Message.Content>
                        {canUploadLicense && (
                            <LicenseSwitchButton
                                isEditLicenseActive={isEditLicenseActive}
                                onClick={onLicenseButtonClick}
                                color="red"
                            />
                        )}
                        <Message.Header>{t('subheader.trialLicenseExpired')}</Message.Header>
                        {canUploadLicense ? (
                            <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: t('action.canUpload.trialLicenseExpired')
                                }}
                            />
                        ) : (
                            <span>{t('action.cannotUpload.common')}</span>
                        )}
                    </Message.Content>
                </Message>
            ) : (
                <Message warning icon>
                    <Icon name="clock outline" />
                    <Message.Content>
                        {canUploadLicense && (
                            <LicenseSwitchButton
                                isEditLicenseActive={isEditLicenseActive}
                                onClick={onLicenseButtonClick}
                                color="brown"
                            />
                        )}

                        <Message.Header>{t('subheader.regularLicenseExpired')}</Message.Header>
                        {canUploadLicense ? (
                            <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: t('action.canUpload.regularLicenseExpired')
                                }}
                            />
                        ) : (
                            <span>{t('action.cannotUpload.common')}</span>
                        )}
                    </Message.Content>
                </Message>
            );
        case Consts.LICENSE.ACTIVE:
            return (
                <Message positive icon>
                    <Icon name="checkmark" />
                    <Message.Content>
                        {canUploadLicense && (
                            <LicenseSwitchButton
                                isEditLicenseActive={isEditLicenseActive}
                                onClick={onLicenseButtonClick}
                                color="green"
                            />
                        )}
                        <Message.Header>{t('subheader.activeLicense')}</Message.Header>
                        <span>{t('action.activeLicense')}</span>
                    </Message.Content>
                </Message>
            );
        default:
            return null;
    }
}

export interface LicensePageProps {
    canUploadLicense: boolean;
    isProductOperational: boolean;
    onLicenseChange: (license: LicenseResponse | null) => void;
    onGoToApp: ButtonProps['onClick'];
    status: LicenseStatus;
    license: LicenseResponse | null;
    manager: Manager;
}

interface LicensePageState {
    error?: string;
    isLoading: boolean;
    isEditLicenseActive: boolean;
    license: string;
}
export class LicensePage extends Component<LicensePageProps, LicensePageState> {
    constructor(props: LicensePageProps) {
        super(props);

        this.state = {
            error: undefined,
            isLoading: false,
            isEditLicenseActive: false,
            license: ''
        };

        this.onErrorDismiss = this.onErrorDismiss.bind(this);
        this.onLicenseButtonClick = this.onLicenseButtonClick.bind(this);
        this.onLicenseEdit = this.onLicenseEdit.bind(this);
        this.onLicenseUpload = this.onLicenseUpload.bind(this);
    }

    componentDidMount() {
        const { manager, onLicenseChange } = this.props;
        this.setState({ isLoading: true });
        return manager
            .doGet<PaginatedResponse<LicenseResponse>>('/license')
            .then(data => {
                const license = data?.items?.[0] || null;
                this.setState({ isLoading: false, error: undefined, isEditLicenseActive: !license });
                onLicenseChange(license);
            })
            .catch(error => this.setState({ isLoading: false, error: error.message }));
    }

    onErrorDismiss() {
        this.setState({ error: undefined });
    }

    onLicenseEdit(
        _event: ChangeEvent<HTMLTextAreaElement>,
        field: Parameters<typeof Stage.Basic.Form.fieldNameValue>[0]
    ) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        const licenseString = fieldNameValue.license as string;
        this.setState({ license: licenseString });
    }

    onLicenseUpload() {
        const { manager, onLicenseChange } = this.props;
        const { license } = this.state;
        this.setState({ isLoading: true });

        return manager
            .doPut('/license', { body: license })
            .then(data => {
                this.setState({ isLoading: false, error: undefined, isEditLicenseActive: false });
                onLicenseChange(data);
            })
            .catch(error => this.setState({ isLoading: false, error: error.message }));
    }

    onLicenseButtonClick() {
        const { isEditLicenseActive } = this.state;
        this.setState({ isEditLicenseActive: !isEditLicenseActive });
    }

    render() {
        const { license: licenseObject, canUploadLicense, isProductOperational, onGoToApp, status } = this.props;
        const { license: licenseString, error, isLoading, isEditLicenseActive } = this.state;

        const isTrial = licenseObject ? licenseObject.trial : false;

        return (
            <FullScreenSegment>
                <HeaderBar className={undefined}>
                    <Banner hideOnSmallScreen={false} />
                </HeaderBar>

                <MessageContainer
                    wide
                    size="large"
                    textAlign="left"
                    loading={isLoading}
                    onRender={SplashLoadingScreen.turnOff}
                >
                    <Header as="h2">
                        <Icon name="key" /> {t('header')}
                    </Header>

                    <DescriptionMessage
                        isTrial={isTrial}
                        status={status}
                        canUploadLicense={canUploadLicense}
                        isEditLicenseActive={isEditLicenseActive}
                        onLicenseButtonClick={this.onLicenseButtonClick}
                    />

                    {canUploadLicense && isEditLicenseActive ? (
                        <UploadLicense
                            error={error}
                            isLoading={isLoading}
                            license={licenseString}
                            onChange={this.onLicenseEdit}
                            onErrorDismiss={this.onErrorDismiss}
                            onUpload={this.onLicenseUpload}
                        />
                    ) : (
                        <CurrentLicense license={licenseObject} />
                    )}

                    <Grid columns="equal">
                        <Grid.Column textAlign="left" verticalAlign="middle">
                            <EulaLink />
                        </Grid.Column>

                        <Grid.Column textAlign="right" verticalAlign="middle">
                            <Button
                                content={t('goToApp')}
                                icon="arrow right"
                                color="green"
                                labelPosition="right"
                                fluid={false}
                                disabled={!isProductOperational}
                                onClick={onGoToApp}
                            />
                        </Grid.Column>
                    </Grid>
                </MessageContainer>
            </FullScreenSegment>
        );
    }
}

const mapStateToProps = (state: ReduxState) => {
    const { manager } = state;
    const { license } = manager;
    const managerAccessor = new Manager(manager);

    return {
        canUploadLicense: StageUtils.isUserAuthorized(Consts.permissions.LICENSE_UPLOAD, manager),
        isProductOperational: Auth.isProductOperational(license),
        license: license.data,
        status: license.status || Consts.LICENSE.EMPTY,
        manager: managerAccessor
    };
};

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => {
    return {
        onLicenseChange: (license: LicenseResponse | null) => {
            dispatch(setLicense(license));
        },
        onGoToApp: () => {
            dispatch(push(Consts.PAGE_PATH.HOME));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LicensePage);
