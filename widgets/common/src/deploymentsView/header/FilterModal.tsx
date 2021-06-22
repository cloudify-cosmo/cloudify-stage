import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';
import { i18nMessagesPrefix, i18nPrefix } from '../common';
import RulesForm from '../../filters/RulesForm';
import { FilterRule } from '../../filters/types';
import useFilterQuery from '../useFilterQuery';

interface FilterModalProps {
    filterRules?: FilterRule[];
    open: boolean;
    onSubmit: (filterRules: FilterRule[], filterId?: string) => void;
    onCancel: () => void;
    toolbox: Stage.Types.Toolbox;
}

const tModal = Stage.Utils.getT(`${i18nPrefix}.header.filter.modal`);
const tMessage = Stage.Utils.getT(i18nMessagesPrefix);

const FilterModal: FunctionComponent<FilterModalProps> = ({
    filterRules: filterRulesProp,
    open,
    onCancel,
    onSubmit,
    toolbox
}) => {
    const { i18n } = Stage;
    const { ApproveButton, CancelButton, Icon, Modal, UnsafelyTypedForm, UnsafelyTypedFormField } = Stage.Basic;
    // @ts-expect-error DynamicDropdown is not converted to TS yet
    const { DynamicDropdown } = Stage.Common;
    const { useBoolean } = Stage.Hooks;

    const { errors, setErrors, clearErrors } = Stage.Hooks.useErrors();
    const [submittedFilterId, setSubmittedFilterId] = useState<string>();
    const [filterId, setFilterId] = useState<string>();
    const [initialFilterRules, setInitialFilterRules] = useState<FilterRule[]>([]);
    const [filterRules, setFilterRules] = useState<FilterRule[]>();
    const [rulesErrorsPresent, setRuleErrorsPresent] = useState<boolean>();

    const [filterDirty, setFilterDirty, unsetFilterDirty] = useBoolean();
    // Saves `filterDirty` value when the modal is submitted, allows for reverting the value when the modal is cancelled
    const [submittedFilterDirty, setSubmittedFilterDirty] = useState<boolean>();

    useEffect(() => {
        if (!filterRulesProp) {
            setFilterId(undefined);
            setSubmittedFilterId(undefined);
            setInitialFilterRules([]);
            setFilterRules(undefined);
        }
    }, [filterRulesProp]);

    function handleSubmit() {
        if (!filterRules?.length) {
            setErrors({
                error: tModal(filterId ? 'noFilterRulesError' : 'noFilterError')
            });
            return;
        }

        if (rulesErrorsPresent) {
            setErrors({
                error: tModal('filterRulesInvalidError')
            });
            return;
        }

        setInitialFilterRules(filterRules);
        setSubmittedFilterId(filterId);
        setSubmittedFilterDirty(filterDirty);
        clearErrors();

        onSubmit(filterRules, filterDirty ? undefined : filterId);
    }

    function handleCancel() {
        onCancel();
        setFilterId(submittedFilterId);
        setFilterRules(filterRulesProp);
        setRuleErrorsPresent(false);
        if (!submittedFilterDirty) unsetFilterDirty();
        clearErrors();
    }

    const filterRulesResult = useFilterQuery(toolbox, filterId);

    function handleFilterIdChange(value: string) {
        setFilterId(value);
        unsetFilterDirty();
        clearErrors();
    }

    function handleFilterRulesChange(newFilterRules: FilterRule[], ruleErrors: boolean) {
        setFilterRules(newFilterRules);
        setFilterDirty();
        setRuleErrorsPresent(ruleErrors);
    }

    useEffect(() => {
        setFilterRules(filterRulesResult.data);
        setInitialFilterRules(filterRulesResult.data ?? []);
    }, [JSON.stringify(filterRulesResult.data)]);

    useEffect(() => {
        if (filterRulesResult.isError) setErrors({ error: tMessage('errorLoadingFilterRules') });
    }, [filterRulesResult.isError]);

    return (
        <Modal open={open} onClose={onCancel} size="large">
            <Modal.Header>
                <Icon name="filter" /> {i18n.t(`${i18nPrefix}.header.filter.modal.header`)}
            </Modal.Header>

            <Modal.Content>
                <UnsafelyTypedForm errors={errors} onErrorsDismiss={clearErrors}>
                    <UnsafelyTypedFormField label={tModal('filterId')}>
                        <DynamicDropdown
                            toolbox={toolbox}
                            onChange={handleFilterIdChange}
                            fetchUrl="/filters/deployments?_include=id"
                            prefetch
                            value={filterId}
                        />
                    </UnsafelyTypedFormField>
                    <UnsafelyTypedFormField label={tModal('filterRules')}>
                        {filterRulesResult.isFetching && <Stage.Basic.LoadingOverlay />}
                        {filterRulesResult.isSuccess && (
                            <RulesForm
                                initialFilters={initialFilterRules}
                                onChange={handleFilterRulesChange}
                                markErrors={!!filterRules?.length}
                                toolbox={toolbox}
                            />
                        )}
                    </UnsafelyTypedFormField>
                </UnsafelyTypedForm>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={handleCancel} />
                <ApproveButton
                    onClick={handleSubmit}
                    color="green"
                    content={i18n.t(`${i18nPrefix}.header.filter.modal.submit`)}
                />
            </Modal.Actions>
        </Modal>
    );
};
export default FilterModal;
