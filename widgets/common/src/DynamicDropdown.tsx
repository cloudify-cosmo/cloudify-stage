import { useCallback, useReducer } from 'react';
import { debounce, isFunction } from 'lodash';
import VisibilitySensor from 'react-visibility-sensor';
import './DynamicDropdown.css';
import type { DropdownItemProps, DropdownOnSearchChangeData, DropdownProps } from 'semantic-ui-react';
import type { DropdownValue } from './types';

let instanceCount = 0;

/**
 * Creates two `useUpdateEffect` hooks to call `fetchTrigger` function with debouncing.
 *
 * @param fetchTrigger function to be called to trigger data fetching
 * @param fetchDeps list of dependencies for delayed `fetchTrigger` call
 */
function useFetchTrigger(fetchTrigger: () => void, fetchDeps: React.DependencyList) {
    const { useUpdateEffect } = Stage.Hooks;
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

interface DynamicDropdownProps extends Omit<DropdownProps, 'onChange'> {
    allowAdditions?: boolean;
    innerRef?: React.Ref<HTMLElement>;
    disabled?: boolean;
    multiple?: boolean;
    placeholder?: string;
    fetchUrl: string;
    fetchAll?: boolean;
    searchParams?: string[];
    value: DropdownValue;
    onChange: (value: DropdownValue) => void;
    onSearchChange?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownOnSearchChangeData) => void;
    toolbox: Stage.Types.WidgetlessToolbox;
    filter?: Record<string, string>;
    valueProp?: string;
    textFormatter?: (item: any) => string;
    pageSize?: number;
    name?: string;
    prefetch?: boolean;
    refreshEvent?: string;
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
    itemsFormatter = _.identity,
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
    ...rest
}: DynamicDropdownProps) {
    const { useState, useEffect } = React;
    const { useEventListener } = Stage.Hooks;

    const [id] = useState(() => {
        instanceCount += 1;
        return `dynamicDropdown${instanceCount}`;
    });
    const [options, setOptions] = useState<Option[]>([]);
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
        if (!_.isEmpty(value)) {
            _.castArray(value).forEach(singleValue => {
                if (!_.find(newOptions, { [valueProp]: singleValue })) {
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

            toolbox
                .getManager()
                .doGet(fetchUrl, {
                    params: searchParams.reduce<Record<string, unknown>>(
                        (result, param) => {
                            result[param] = searchQuery;

                            return result;
                        },
                        {
                            _sort: valueProp,
                            _size: pageSize,
                            _offset: nextPage * pageSize
                        }
                    )
                })
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
        if (_.isEmpty(value)) {
            setOptions(latestOptions => _.reject(latestOptions, 'implicit'));
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

    const filteredOptions = _(options)
        .filter(option =>
            _(filter)
                .mapValues(v => toolbox.getContext().getValue(v))
                .map((v, k) => _.isEmpty(v) || _.isEmpty(option[k]) || _.includes(v, option[k]))
                .every(Boolean)
        )
        .uniqBy(valueProp)
        .value();

    function getDropdownValue(): DropdownProps['value'] {
        if (!value) {
            return multiple ? [] : '';
        }

        const valueArray = _.castArray(value);

        return multiple ? valueArray : valueArray[0];
    }

    const { Form, Loading, Ref } = Stage.Basic;

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
                onAddItem={(_event, data) =>
                    setOptions(latestOptions => [{ [valueProp]: data.value as string }, ...latestOptions])
                }
                onChange={(_event, data) => onChange(!_.isEmpty(data.value) ? (data.value as string | string[]) : null)}
                onSearchChange={(event, data) => {
                    setSearchQuery(data.searchQuery);
                    if (isFunction(onSearchChange)) onSearchChange(event, data);
                }}
                multiple={multiple}
                loading={isLoading}
                options={((): DropdownItemProps[] => {
                    const preparedOptions = filteredOptions.map(
                        (item): DropdownItemProps => ({
                            text: (textFormatter ?? ((i: Record<string, string>) => i[valueProp]))(item),
                            value: item[valueProp]
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

DynamicDropdown.propTypes = {
    allowAdditions: PropTypes.bool,
    innerRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }),
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    placeholder: PropTypes.string,
    fetchUrl: PropTypes.string.isRequired,
    fetchAll: PropTypes.bool,
    searchParam: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    filter: PropTypes.shape({}),
    valueProp: PropTypes.string,
    textFormatter: PropTypes.func,
    pageSize: PropTypes.number,
    name: PropTypes.string,
    prefetch: PropTypes.bool,
    className: PropTypes.string,
    refreshEvent: PropTypes.string,
    itemsFormatter: PropTypes.func
};

declare global {
    namespace Stage.Common {
        export { DynamicDropdown };
    }
}

Stage.defineCommon({
    name: 'DynamicDropdown',
    common: DynamicDropdown
});
