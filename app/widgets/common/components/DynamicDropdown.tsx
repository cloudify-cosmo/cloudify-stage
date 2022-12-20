import React, { useCallback, useReducer } from 'react';
import {
    castArray,
    chain,
    debounce,
    find,
    identity,
    includes,
    isArray,
    isEmpty,
    isFunction,
    isUndefined,
    reject,
    some
} from 'lodash';
import VisibilitySensor from 'react-visibility-sensor';
import './DynamicDropdown.css';
import type { DropdownItemProps, DropdownOnSearchChangeData, DropdownProps } from 'semantic-ui-react';
import { Form, Loading, Ref } from '../../../components/basic';
import useEventListener from '../../../utils/hooks/useEventListener';
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect';
import type { DropdownValue } from '../types';
import type { FilterRule } from '../filters/types';

let instanceCount = 0;

/**
 * Creates two `useUpdateEffect` hooks to call `fetchTrigger` function with debouncing.
 *
 * @param fetchTrigger function to be called to trigger data fetching
 * @param fetchDeps list of dependencies for delayed `fetchTrigger` call
 */
function useFetchTrigger(fetchTrigger: () => void, fetchDeps: React.DependencyList) {
    const delayMs = 500;
    const delayedFetchTrigger = useCallback(debounce(fetchTrigger, delayMs), []);

    useUpdateEffect(() => {
        delayedFetchTrigger();
    }, fetchDeps);
}

const fetchActionType = {
    PREPARE_FOR_FIRST_PAGE_FETCH: 'prepareForFirstPageFetch',
    PREPARE_FOR_NEXT_PAGE_FETCH: 'prepareForNextPageFetch',
    TRIGGER_FETCH: 'triggerFetch',
    END_FETCH: 'endFetch'
} as const;
const defaultFetchState = { hasMore: true, currentPage: -1, shouldLoadMore: false };
type FetchReducerAction =
    | { type: typeof fetchActionType['PREPARE_FOR_FIRST_PAGE_FETCH'] }
    | { type: typeof fetchActionType['PREPARE_FOR_NEXT_PAGE_FETCH']; currentPage: number; hasMore: boolean }
    | { type: typeof fetchActionType['TRIGGER_FETCH'] }
    | { type: typeof fetchActionType['END_FETCH'] };

function fetchReducer(state: typeof defaultFetchState, action: FetchReducerAction) {
    switch (action.type) {
        case fetchActionType.PREPARE_FOR_FIRST_PAGE_FETCH:
            return { ...defaultFetchState };
        case fetchActionType.PREPARE_FOR_NEXT_PAGE_FETCH:
            return {
                currentPage: action.currentPage,
                hasMore: action.hasMore,
                shouldLoadMore: false
            };
        case fetchActionType.TRIGGER_FETCH:
            return { ...state, shouldLoadMore: true };
        case fetchActionType.END_FETCH:
            return { ...defaultFetchState, hasMore: false };
        default:
            throw new Error(`Unknown action type: ${(action as any).type}.`);
    }
}

/** May also contain an `implicit` property, but it's hard to model in TypeScript */
type Option = { [valueProp: string]: string };

export interface DynamicDropdownProps extends Omit<DropdownProps, 'onChange'> {
    allowAdditions?: boolean;
    innerRef?: React.Ref<HTMLElement>;
    disabled?: boolean;
    multiple?: boolean;
    placeholder?: string;
    fetchUrl: string;
    filterRules?: FilterRule[];
    fetchAll?: boolean;
    searchParams?: string[];
    value: DropdownValue;
    onChange: (value: DropdownValue, added: boolean) => void;
    onSearchChange?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownOnSearchChangeData) => void;
    toolbox: Stage.Types.WidgetlessToolbox;
    filter?: Record<string, string>;
    valueProp?: string;
    textFormatter?: (item: any) => string;
    pageSize?: number;
    name?: string;
    prefetch?: boolean;
    refreshEvent?: string;
    constraints?: Array<any>;
    itemsFormatter?: (items: any[]) => Option[];
}

export default function DynamicDropdown({
    fetchUrl,
    onChange,
    toolbox,
    allowAdditions = false,
    className = '',
    disabled = false,
    fetchAll = false,
    searchParams = ['_search'],
    filter = {},
    innerRef = null,
    itemsFormatter = identity,
    multiple = false,
    name,
    onSearchChange = undefined,
    pageSize = 10,
    placeholder,
    prefetch = false,
    refreshEvent,
    textFormatter,
    value,
    valueProp = 'id',
    constraints,
    filterRules,
    ...rest
}: DynamicDropdownProps) {
    const { useState, useEffect } = React;

    const [id] = useState(() => {
        instanceCount += 1;
        return `dynamicDropdown${instanceCount}`;
    });
    const [options, setOptions] = useState<Option[]>([]);
    const [addedItems, setAddedItems] = useState<string[]>([]);
    const [fetchState, dispatchFetchAction] = useReducer(fetchReducer, {
        ...defaultFetchState,
        shouldLoadMore: prefetch
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState(false);

    /**
     * Returns list of implicit dropdown options calculated by comparing
     * elements from `value` prop and elements from `newOptions` argument.
     *
     * @param newOptions list of options used for comparison
     */
    function getImplicitOptions(newOptions: Option[]) {
        const implicitOptions: Option[] = [];
        if (!isEmpty(value)) {
            castArray(value).forEach(singleValue => {
                if (!find(newOptions, { [valueProp]: singleValue })) {
                    // NOTE: no elegant way was found to have `implicit` prop in TS
                    implicitOptions.push({ [valueProp]: singleValue, implicit: true as any });
                }
            });
        }
        return implicitOptions;
    }

    function loadMore() {
        setLoading(true);

        function dispatchEndFetchAction() {
            dispatchFetchAction({ type: fetchActionType.END_FETCH });
        }

        function onFetchFailed(error: unknown) {
            dispatchEndFetchAction();
            log.error(error);
        }

        function onFetchFinished() {
            setLoading(false);
        }

        if (fetchAll) {
            toolbox
                .getManager()
                .doGetFull(fetchUrl, undefined)
                .then((data: Stage.Types.PaginatedResponse<unknown>) => {
                    dispatchEndFetchAction();
                    setOptions(itemsFormatter(data.items));
                })
                .catch(onFetchFailed)
                .finally(onFetchFinished);
        } else {
            const nextPage = fetchState.currentPage + 1;
            const params = searchParams.reduce<Record<string, unknown>>(
                (result, param) => {
                    result[param] = searchQuery;

                    return result;
                },
                {
                    _sort: valueProp,
                    _size: pageSize,
                    _offset: nextPage * pageSize
                }
            );
            let fetchPromise;

            if (!isUndefined(constraints)) {
                const constraintsObject = isArray(constraints) ? Object.assign({}, ...constraints) : {};
                fetchPromise = toolbox.getManager().doPost(fetchUrl, {
                    params,
                    body: { constraints: constraintsObject }
                });
            } else if (!isUndefined(filterRules)) {
                fetchPromise = toolbox.getManager().doPost(fetchUrl, {
                    params,
                    body: { filter_rules: filterRules }
                });
            } else {
                fetchPromise = toolbox.getManager().doGet(fetchUrl, {
                    params
                });
            }
            fetchPromise
                .then(data => {
                    const isMoreDataAvailable = data.metadata.pagination.total > (nextPage + 1) * pageSize;
                    if (isMoreDataAvailable) {
                        dispatchFetchAction({
                            type: fetchActionType.PREPARE_FOR_NEXT_PAGE_FETCH,
                            currentPage: nextPage,
                            hasMore: true
                        });
                    } else {
                        dispatchEndFetchAction();
                    }

                    const newOptions = itemsFormatter(data.items);
                    setOptions(latestOptions => [
                        ...(nextPage === 0 ? getImplicitOptions(newOptions) : latestOptions),
                        ...newOptions
                    ]);
                })
                .catch(onFetchFailed)
                .finally(onFetchFinished);
        }
    }

    useEffect(() => {
        if (fetchState.shouldLoadMore && !disabled) loadMore();
    }, [fetchState.shouldLoadMore, disabled]);

    useEventListener(toolbox, refreshEvent, () =>
        dispatchFetchAction({ type: fetchActionType.PREPARE_FOR_FIRST_PAGE_FETCH })
    );

    useEffect(() => {
        if (isEmpty(value)) {
            setOptions(latestOptions => reject(latestOptions, 'implicit'));
        } else {
            const optionsToAdd = getImplicitOptions(options);
            if (optionsToAdd.length > 0) {
                setOptions(latestOptions => [...optionsToAdd, ...latestOptions]);
            }
        }
    }, [value]);

    useFetchTrigger(() => {
        dispatchFetchAction({ type: fetchActionType.PREPARE_FOR_FIRST_PAGE_FETCH });
        dispatchFetchAction({ type: fetchActionType.TRIGGER_FETCH });
    }, [searchQuery, fetchUrl]);

    const filteredOptions = chain(options)
        .filter(option =>
            chain(filter)
                .mapValues(v => toolbox.getContext().getValue(v))
                .map((v, k) => isEmpty(v) || isEmpty(option[k]) || includes(v, option[k]))
                .every(Boolean)
                .value()
        )
        .uniqBy(valueProp)
        .value();

    function getDropdownValue(): DropdownProps['value'] {
        if (!value) {
            return multiple ? [] : '';
        }

        const valueArray = castArray(value);

        return multiple ? valueArray : valueArray[0];
    }

    return (
        <Ref innerRef={innerRef}>
            <Form.Dropdown
                disabled={disabled}
                className={`dynamic ${className}`}
                search
                selection
                selectOnBlur={false}
                placeholder={placeholder}
                fluid
                value={getDropdownValue()}
                id={id}
                name={name}
                allowAdditions={allowAdditions}
                onAddItem={(_event, data) => {
                    setOptions(latestOptions => [{ [valueProp]: data.value as string }, ...latestOptions]);
                    setAddedItems([...addedItems, data.value as string]);
                }}
                onChange={(_event, data) =>
                    onChange(
                        !isEmpty(data.value) ? (data.value as string | string[]) : null,
                        !some(options, { [valueProp]: data.value }) || addedItems.includes(data.value as string)
                    )
                }
                onSearchChange={(event, data) => {
                    setSearchQuery(data.searchQuery);
                    if (isFunction(onSearchChange)) onSearchChange(event, data);
                }}
                onBlur={(event, data) => {
                    if (!isFunction(onSearchChange)) setSearchQuery('');
                    if (isFunction(rest.onBlur)) rest.onBlur(event, data);
                }}
                multiple={multiple}
                loading={isLoading}
                options={((): DropdownItemProps[] => {
                    const preparedOptions = filteredOptions.map(
                        (item): DropdownItemProps => ({
                            text: (textFormatter ?? ((i: Record<string, string>) => i[valueProp]))(item),
                            value: item[valueProp],
                            title: item[valueProp]
                        })
                    );
                    if (fetchState.hasMore) {
                        preparedOptions.push({
                            disabled: true,
                            icon: (
                                <VisibilitySensor
                                    active={!isLoading}
                                    containment={document.querySelector(`#${id} .menu`)}
                                    partialVisibility
                                    onChange={isVisible => {
                                        if (isVisible) dispatchFetchAction({ type: fetchActionType.TRIGGER_FETCH });
                                    }}
                                >
                                    <Loading message="" />
                                </VisibilitySensor>
                            ),
                            key: 'loader',
                            text: searchQuery
                        });
                    }
                    return preparedOptions;
                })()}
                {...rest}
            />
        </Ref>
    );
}
