import { FunctionComponent, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import type { Filter, FilterRule } from '../../common/src/filters/types';

export interface FilterModalProps {
    initialFilter?: Filter;
    initialFilterIdSuffix?: string;
    showFilterIdInput?: boolean;
    i18nHeaderKey: string;
    onSubmit: (filterId: string, filterRules: FilterRule[]) => Promise<void>;
    onCancel: () => void;
    toolbox: Stage.Types.Toolbox;
}

const { Form } = Stage.Basic;

const FilterModal: FunctionComponent<FilterModalProps> = ({
    i18nHeaderKey,
    initialFilter,
    initialFilterIdSuffix = '',
    showFilterIdInput,
    onCancel,
    onSubmit,
    toolbox
}) => {
    const initialFilterRules = useMemo(
        () => (initialFilter ? [...initialFilter.attrs_filter_rules, ...initialFilter.labels_filter_rules] : []),
        [initialFilter]
    );

    const { useInput, useErrors } = Stage.Hooks;
    const [filterId, setFilterId] = useInput((initialFilter?.id ?? '') + initialFilterIdSuffix);
    const [filterRules, setFilterRules] = useInput(initialFilterRules);
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [filterRulesInvalid, setFilterRulesInvalid] = useState(!initialFilter);
    const { i18n } = Stage;

    function handleSubmit() {
        clearErrors();

        const detectedErrors: { filterId?: string; filterRules?: string } = {};
        if (showFilterIdInput && !filterId) {
            detectedErrors.filterId = i18n.t('widgets.filters.modal.errors.idMissing');
        }
        if (filterRulesInvalid) {
            detectedErrors.filterRules = i18n.t('widgets.filters.modal.errors.filterRulesInvalid');
        }

        if (!isEmpty(detectedErrors)) {
            setErrors(detectedErrors);
            return;
        }

        onSubmit(filterId, filterRules).then(toolbox.refresh).catch(setMessageAsError);
    }

    const { ApproveButton, CancelButton, Icon, Modal } = Stage.Basic;
    const { RulesForm } = Stage.Common.Filters;
    const markRulesFormErrors = !isEmpty(errors);

    return (
        <Modal open onClose={onCancel} size="large">
            <Modal.Header>
                <Icon name="filter" /> {i18n.t(i18nHeaderKey, { filterId: initialFilter?.id })}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {showFilterIdInput && (
                        <Form.Field label={i18n.t('widgets.filters.modal.id')}>
                            <Form.Input value={filterId} required onChange={setFilterId} error={errors.filterId} />
                        </Form.Field>
                    )}
                    <Form.Field label={i18n.t('widgets.filters.modal.rules')}>
                        <RulesForm
                            resourceType="deployments"
                            initialFilters={initialFilterRules}
                            toolbox={toolbox}
                            onChange={(newFilterRules, hasErrors) => {
                                setFilterRules(newFilterRules);
                                setFilterRulesInvalid(hasErrors);
                            }}
                            markErrors={markRulesFormErrors}
                            minLength={1}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onCancel} />
                <ApproveButton onClick={handleSubmit} color="green" />
            </Modal.Actions>
        </Modal>
    );
};

export default FilterModal;
