import React from 'react';
import i18n from 'i18next';
import DeploymentActions from './DeploymentActions';
import { ApproveButton, CancelButton, Form, Icon, Modal } from '../../../components/basic';
import { useBoolean, useErrors, useInput, useOpenProp, useResettableState } from '../../../utils/hooks';
import StageUtils from '../../../utils/stageUtils';
import type { Site } from '../map/site';

interface SetSiteModalProps {
    deploymentId: string;
    deploymentName: string;
    toolbox: Stage.Types.WidgetlessToolbox;
    open: boolean;
    onHide: () => void;
}

export default function SetSiteModal({ deploymentId, deploymentName, onHide, open, toolbox }: SetSiteModalProps) {
    const [detachSite, setDetachSite, clearDetachSite] = useInput(false);
    const { errors, clearErrors, setMessageAsError } = useErrors();
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [siteName, setSiteName, clearSiteName] = useInput('');
    const [sites, setSites, resetSites] = useResettableState<Pick<Site, 'name'>[]>([]);

    const siteOptions = _.map(sites, site => {
        return { text: site.name, value: site.name };
    });

    useOpenProp(open, () => {
        const actions = new DeploymentActions(toolbox.getManager());

        setLoading();
        clearDetachSite();
        clearSiteName();
        clearErrors();
        resetSites();

        Promise.all([actions.doGetSitesNames(), actions.doGetSiteName(deploymentId)])
            .then(([fetchedSites, fetchedSiteName]) => {
                setSites(fetchedSites.items);
                setSiteName(fetchedSiteName);
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    });

    function setSite() {
        setLoading();

        const actions = new DeploymentActions(toolbox.getManager());
        actions
            .doSetSite(deploymentId, siteName, detachSite)
            .then(() => {
                // State updates should be done before calling `onHide` to avoid React errors:
                // "Warning: Can't perform a React state update on an unmounted component"
                clearErrors();
                toolbox.getEventBus().trigger('deployments:refresh');
                unsetLoading();
                onHide();
            })
            .catch(error => {
                setMessageAsError(error);
                unsetLoading();
            });
    }

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="edit" />
                {i18n.t(`widgets.common.deployments.setSiteModal.header`, {
                    deploymentName: StageUtils.formatDisplayName({ id: deploymentId, displayName: deploymentName })
                })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={loading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field
                        error={errors.siteName}
                        label={i18n.t('widgets.common.deployments.setSiteModal.siteNameLabel')}
                    >
                        <Form.Dropdown
                            search
                            selection
                            value={siteName}
                            name="siteName"
                            options={siteOptions}
                            onChange={(_event, field) => setSiteName(field.value)}
                        />
                    </Form.Field>
                    <Form.Field className="detachSite">
                        <Form.Checkbox
                            toggle
                            label={i18n.t('widgets.common.deployments.setSiteModal.detachSiteLabel')}
                            name="detachSite"
                            checked={detachSite}
                            onChange={(_event, field) => setDetachSite(field.checked)}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={loading} />
                <ApproveButton
                    onClick={setSite}
                    disabled={loading}
                    content={i18n.t('widgets.common.deployments.setSiteModal.updateButton')}
                    icon="edit"
                />
            </Modal.Actions>
        </Modal>
    );
}
