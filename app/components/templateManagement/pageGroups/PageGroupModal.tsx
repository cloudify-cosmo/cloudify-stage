import _, { includes, isEmpty } from 'lodash';
import React from 'react';
import type { ModalProps, SemanticICONS } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useBoolean, useErrors, useInput, useOpen, useResettableState } from '../../../utils/hooks';
import { ApproveButton, CancelButton, Divider, Form, Icon, LoadingOverlay, Modal, Segment } from '../../basic';
import type { ReduxState } from '../../../reducers';
import StageUtils from '../../../utils/stageUtils';
import SelectionList from '../common/SelectionList';
import SortableList from '../common/SortableList';
import { SemanticIconDropdown } from '../../shared';

const translate = StageUtils.getT('templates.pageGroupManagement.modal');

interface PageGroupModalProps {
    initialGroupName?: string;
    initialPages?: string[];
    initialIcon?: SemanticICONS;
    trigger: ModalProps['trigger'];
    onSubmit: (groupName: string, pageIds: string[], icon?: SemanticICONS) => Promise<any>;
}

const PageGroupModal: React.FunctionComponent<PageGroupModalProps> = ({
    trigger,
    initialGroupName = '',
    initialPages = [],
    initialIcon,
    onSubmit
}) => {
    const allAvailablePages = useSelector((state: ReduxState) => Object.keys(state.templates.pagesDef));
    const [selectedPages, setSelectedPages, resetSelectedPages] = useResettableState<string[]>(initialPages);

    const { errors, setErrors, setMessageAsError, clearErrors } = useErrors();
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [groupName, setGroupName, resetGroupName] = useInput(initialGroupName);
    const [icon, setIcon, resetIcon] = useInput(initialIcon);
    const [open, doOpen, doClose] = useOpen(() => {
        resetGroupName();
        resetSelectedPages();
        resetIcon();
        clearErrors();
    });

    const editMode = !isEmpty(initialGroupName);

    function handleSubmit() {
        const submitErrors: {
            groupName?: string;
            selectedPages?: string;
        } = {};

        if (_.isEmpty(_.trim(groupName))) {
            submitErrors.groupName = translate('errors.groupName');
        }

        if (_.isEmpty(selectedPages)) {
            submitErrors.selectedPages = translate('errors.selectedPages');
        }

        if (!_.isEmpty(submitErrors)) {
            setErrors(submitErrors);
            return;
        }

        setLoading();
        onSubmit(groupName, selectedPages, icon).then(doClose).catch(setMessageAsError).finally(unsetLoading);
    }

    function handlePageAdd(pageId: string) {
        clearErrors();
        setSelectedPages([...selectedPages, pageId]);
    }

    return (
        <Modal trigger={trigger} open={open} onOpen={doOpen} onClose={doClose}>
            {loading && <LoadingOverlay />}

            <Modal.Header>
                <Icon name="folder open outline" />
                {editMode ? (
                    <span>
                        {translate('updateHeader', {
                            pageGroupName: initialGroupName
                        })}
                    </span>
                ) : (
                    <span>{translate('createHeader')}</span>
                )}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors}>
                    <Form.Field error={errors.groupName} label={translate('groupName')}>
                        <Form.Input
                            value={groupName}
                            onChange={(...args) => {
                                clearErrors();
                                setGroupName(...args);
                            }}
                        />
                    </Form.Field>
                    <Form.Field label={translate('icon')}>
                        <SemanticIconDropdown value={icon} onChange={setIcon} />
                    </Form.Field>
                    <Segment.Group horizontal>
                        <Segment style={{ width: '50%' }}>
                            <Icon name="file outline" /> {translate('availablePages')}
                            <Divider />
                            <SelectionList
                                items={allAvailablePages.filter(pageId => !includes(selectedPages, pageId))}
                                onItemSelected={handlePageAdd}
                                noDataMessageI18nKey="pageGroupManagement.modal.noPagesAvailable"
                                addIconTitleI18nKey="pageGroupManagement.modal.addPage"
                            />
                        </Segment>
                        <SortableList
                            icon="file outline"
                            items={selectedPages.map(pageId => ({ item: pageId, id: pageId, name: pageId }))}
                            titleI18nKey="pageGroupManagement.modal.selectedPages"
                            noDataMessageI18nKey="pageGroupManagement.modal.noPagesSelected"
                            onUpdate={setSelectedPages}
                        />
                    </Segment.Group>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} />
                <ApproveButton
                    content={editMode ? translate('submitUpdate') : translate('submitCreate')}
                    icon={editMode ? 'edit' : 'checkmark'}
                    onClick={handleSubmit}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default PageGroupModal;
