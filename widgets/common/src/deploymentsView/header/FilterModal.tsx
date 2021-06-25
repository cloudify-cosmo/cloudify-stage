import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';
import { i18nMessagesPrefix, i18nPrefix } from '../common';
import RulesForm from '../../filters/RulesForm';
import { FilterRule } from '../../filters/types';
import useFilterQuery from '../useFilterQuery';
import FilterActions from '../../filters/FilterActions';

interface FilterModalProps {
    userFilterSelected: boolean;
    open: boolean;
    onSubmit: (filterRules: FilterRule[], filterId?: string) => void;
    onCancel: () => void;
    toolbox: Stage.Types.Toolbox;
}

const tModal = Stage.Utils.getT(`${i18nPrefix}.header.filter.modal`);
const tMessage = Stage.Utils.getT(i18nMessagesPrefix);

function useRevertableState<T>(initialValue: T) {
    const { useResettableState } = Stage.Hooks;

    const [value, setValue, resetValue] = useResettableState<T>(initialValue);
    const [savedValue, setSavedValue, resetSavedValue] = useResettableState<T>(initialValue);

    return {
        value,
        set: setValue,
        save: () => setSavedValue(value),
        revert: () => setValue(savedValue),
        reset: () => {
            resetValue();
            resetSavedValue();
        }
    };
}

function useRevertableStates(...revertableStates: Omit<ReturnType<typeof useRevertableState>, 'set'>[]) {
    return {
        save: () => revertableStates.forEach(s => s.save()),
        revert: () => revertableStates.forEach(s => s.revert()),
        reset: () => revertableStates.forEach(s => s.reset())
    };
}

const FilterModal: FunctionComponent<FilterModalProps> = ({
    userFilterSelected,
    open,
    onCancel,
    onSubmit,
    toolbox
}) => {
    const { i18n } = Stage;
    const {
        ApproveButton,
        Button,
        CancelButton,
        Dimmer,
        Dropdown,
        Icon,
        Input,
        Modal,
        UnsafelyTypedForm,
        UnsafelyTypedFormField
    } = Stage.Basic;
    // @ts-expect-error DynamicDropdown is not converted to TS yet
    const { DynamicDropdown } = Stage.Common;
    const { useBoolean, useErrors, useInput } = Stage.Hooks;

    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [rulesErrorsPresent, setRuleErrorsPresent] = useState<boolean>();

    const [filterSaving, setFilterSaving, unsetFilterSaving] = useBoolean();
    const [saveAsModeActive, activateSaveAsMode, deactivateSaveAsMode] = useBoolean();
    const [newFilterId, setNewFilterId, clearNewFilterId] = useInput('');

    // The values are 'saved' on modal submit and 'reverted' on modal cancel
    const filterId = useRevertableState<string | undefined>(undefined);
    const filterRules = useRevertableState<FilterRule[]>([]);
    const filterDirty = useRevertableState<boolean>(false);
    const modalState = useRevertableStates(filterId, filterRules, filterDirty);

    const filterRulesResult = useFilterQuery(toolbox, filterId.value);

    // Used to initialize RulesForm
    const [initialFilterRules, setInitialFilterRules] = useState<FilterRule[]>([]);

    useEffect(() => {
        if (!userFilterSelected) modalState.reset();
    }, [userFilterSelected]);

    function handleSubmit() {
        if (!filterRules.value?.length) {
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

        modalState.save();
        setInitialFilterRules(filterRules.value);
        clearErrors();

        onSubmit(filterRules.value, filterDirty.value ? undefined : filterId.value);
    }

    function handleCancel() {
        onCancel();
        modalState.revert();
        setRuleErrorsPresent(false);
        clearErrors();
    }

    function handleFilterIdChange(value: string) {
        filterId.set(value);
        filterDirty.set(false);
        clearErrors();
    }

    function handleFilterRulesChange(newFilterRules: FilterRule[], ruleErrors: boolean) {
        filterRules.set(newFilterRules);
        filterDirty.set(true);
        clearErrors();
        setRuleErrorsPresent(ruleErrors);
    }

    function handleSave() {
        if (rulesErrorsPresent) {
            setErrors({
                error: tModal('filterRulesInvalidError')
            });
            return;
        }

        setFilterSaving();
        new FilterActions(toolbox)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .doUpdate(filterId.value!, filterRules.value)
            .then(() => filterDirty.set(false))
            .catch(setMessageAsError)
            .finally(unsetFilterSaving);
    }

    function handleSaveAsCancel() {
        deactivateSaveAsMode();
        clearNewFilterId();
        clearErrors();
    }

    function handleSaveAsSubmit() {
        if (!filterRules.value?.length) {
            setErrors({
                error: tModal('noFilterRulesError')
            });
            return;
        }

        if (rulesErrorsPresent) {
            setErrors({
                error: tModal('filterRulesInvalidError')
            });
            return;
        }

        if (!newFilterId) {
            setErrors({
                error: tModal('filterIdMissingError')
            });
            return;
        }

        setFilterSaving();
        new FilterActions(toolbox)
            .doCreate(newFilterId, filterRules.value)
            .then(() => {
                filterDirty.set(false);
                filterId.set(newFilterId);
                clearNewFilterId();
                clearErrors();
                deactivateSaveAsMode();
            })
            .catch(setMessageAsError)
            .finally(unsetFilterSaving);
    }

    useEffect(() => {
        const newFilterRules = filterRulesResult.data?.value ?? [];
        filterRules.set(newFilterRules);
        setInitialFilterRules(newFilterRules);
    }, [JSON.stringify(filterRulesResult.data)]);

    useEffect(() => {
        if (filterRulesResult.isError) setErrors({ error: tMessage('errorLoadingFilterRules') });
    }, [filterRulesResult.isError]);

    const interactionsDisabled = filterRulesResult.isFetching || filterSaving;

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
                            value={filterId.value}
                        />
                    </UnsafelyTypedFormField>
                    <UnsafelyTypedFormField label={tModal('filterRules')}>
                        {interactionsDisabled && <Stage.Basic.LoadingOverlay />}
                        {filterRulesResult.isSuccess && (
                            <RulesForm
                                initialFilters={initialFilterRules}
                                onChange={handleFilterRulesChange}
                                markErrors={!!filterRules.value?.length}
                                toolbox={toolbox}
                            />
                        )}
                    </UnsafelyTypedFormField>
                </UnsafelyTypedForm>
            </Modal.Content>

            <Modal.Actions style={{ position: 'relative' }}>
                <Dimmer active={interactionsDisabled} inverted />
                {saveAsModeActive ? (
                    <div style={{ float: 'left' }}>
                        <Input
                            placeholder={tModal('filterIdPlaceholder')}
                            style={{ marginRight: '0.25em' }}
                            value={newFilterId}
                            onChange={setNewFilterId}
                        />
                        <Button icon="cancel" onClick={handleSaveAsCancel} title={tModal('cancel')} />
                        <Button content={tModal('saveNew')} onClick={handleSaveAsSubmit} />
                    </div>
                ) : (
                    <Button.Group style={{ float: 'left', position: 'relative' }}>
                        <Button
                            content={tModal('save')}
                            disabled={!filterId.value || !filterDirty.value || filterRulesResult.data?.is_system_filter}
                            onClick={handleSave}
                        />
                        <Dropdown
                            className="button icon"
                            options={[{ text: tModal('saveAs'), onClick: activateSaveAsMode, key: '' }]}
                            trigger={<></>}
                            style={{ position: 'unset' }}
                        />
                    </Button.Group>
                )}
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
