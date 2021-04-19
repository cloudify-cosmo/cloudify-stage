import { FunctionComponent } from 'react';
import { Filter } from './types';
import type { FilterRule } from '../../common/src/filters/types';

export interface FilterModalProps {
    initialFilter?: Filter;
    initialFilterIdSuffix?: string;
    showFilterIdInput?: boolean;
    i18nHeaderKey: string;
    onSubmit: (filterId: string, filterRules: FilterRule[]) => Promise<void>;
    onCancel: () => void;
    toolbox: Stage.Types.Toolbox;
}

const { Form, UnsafelyTypedForm, UnsafelyTypedFormField } = Stage.Basic;

const FilterModal: FunctionComponent<FilterModalProps> = ({
    i18nHeaderKey,
    initialFilter,
    initialFilterIdSuffix = '',
    showFilterIdInput,
    onCancel,
    onSubmit,
    toolbox
}) => {
    const { useInput, useErrors } = Stage.Hooks;
    const [filterId, setFilterId] = useInput((initialFilter?.id ?? '') + initialFilterIdSuffix);
    const [filterRules, setFilterRules] = useInput(
        initialFilter ? [...initialFilter.attrs_filter_rules, ...initialFilter.labels_filter_rules] : []
    );
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const { i18n } = Stage;

    function handleSubmit() {
        clearErrors();

        if (showFilterIdInput && !filterId) {
            setErrors({ filterId: i18n.t('widgets.filters.modal.idMissing') });
            return;
        }

        onSubmit(filterId, filterRules).then(toolbox.refresh).catch(setMessageAsError);
    }

    const { ApproveButton, CancelButton, Icon, Modal } = Stage.Basic;
    const { RulesForm } = Stage.Common.Filters;
    return (
        <Modal open onClose={onCancel}>
            <Modal.Header>
                <Icon name="filter" /> {i18n.t(i18nHeaderKey, { filterId: initialFilter?.id })}
            </Modal.Header>

            <Modal.Content>
                <UnsafelyTypedForm errors={errors} onErrorsDismiss={clearErrors}>
                    {showFilterIdInput && (
                        <UnsafelyTypedFormField label={i18n.t('widgets.filters.modal.id')}>
                            <Form.Input value={filterId} required onChange={setFilterId} error={errors.filterId} />
                        </UnsafelyTypedFormField>
                    )}
                    <UnsafelyTypedFormField label={i18n.t('widgets.filters.modal.rules')}>
                        <RulesForm initialFilters={filterRules} toolbox={toolbox} onChange={setFilterRules} />
                    </UnsafelyTypedFormField>
                </UnsafelyTypedForm>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onCancel} />
                <ApproveButton onClick={handleSubmit} color="green" />
            </Modal.Actions>
        </Modal>
    );
};

export default FilterModal;
