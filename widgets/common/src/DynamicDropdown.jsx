// NOTE: Disabling react/require-default-props as default values are provided in component's definition
/* eslint-disable react/require-default-props */
import { useCallback, useReducer } from 'react';
import { debounce, isFunction } from 'lodash';
import VisibilitySensor from 'react-visibility-sensor';
import './DynamicDropdown.css';

let instanceCount = 0;
const defaultFetchState = { hasMore: true, currentPage: -1, shouldLoadMore: false };

/**
 * Creates two `useUpdateEffect` hooks to call `fetchTrigger` function with debouncing.
 *
 * @param {function(shouldReset: boolean): void} fetchTrigger function to be called to trigger data fetching,
 * accepts single boolean argument
 * @param {React.DependencyList} withoutResetFetchDeps list of dependencies for delayed `fetchTrigger` call with
`shouldReset` argument set to false
 * @param {React.DependencyList} withResetFetchDeps list of dependencies for delayed `fetchTrigger` call with
 * `shouldReset` argument set to true
 */
function useFetchTrigger(fetchTrigger, withoutResetFetchDeps, withResetFetchDeps) {
    const { useUpdateEffect } = Stage.Hooks;
    const delayMs = 500;
    const delayedFetchTrigger = useCallback(
        debounce(shouldReset => fetchTrigger(shouldReset), delayMs),
        []
    );

    useUpdateEffect(() => {
        delayedFetchTrigger(false);
    }, withoutResetFetchDeps);

    useUpdateEffect(() => {
        delayedFetchTrigger(true);
    }, withResetFetchDeps);
}

const fetchActionType = {
    PREPARE_FOR_INITIAL_FETCH: 'prepareForInitialFetch',
    PREPARE_FOR_NEXT_PAGE_FETCH: 'prepareForNextPageFetch',
    TRIGGER_FETCH: 'triggerFetch',
    END_FETCH: 'endFetch'
};
function fetchReducer(state, action) {
    switch (action.type) {
        case fetchActionType.PREPARE_FOR_INITIAL_FETCH:
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
            throw new Error(`Unknown action type: ${action.type}.`);
    }
}

export default function DynamicDropdown({
    fetchUrl,
    onChange,
    toolbox,
    allowAdditions = false,
    className = '',
    disabled = false,
    fetchAll = false,
    filter = {},
    innerRef = null,
    itemsFormatter = _.identity,
    multiple = false,
    name = null,
    onSearchChange = undefined,
    pageSize = 10,
    placeholder = null,
    prefetch = false,
    refreshEvent = null,
    textFormatter = null,
    value = null,
    valueProp = 'id',
    ...rest
}) {
    const { useState, useEffect } = React;
    const { useBoolean, useEventListener } = Stage.Hooks;

    const [id] = useState(() => {
        instanceCount += 1;
        return `dynamicDropdown${instanceCount}`;
    });
    const [options, setOptions] = useState([]);
    const [fetchState, dispatchFetchAction] = useReducer(fetchReducer, {
        ...defaultFetchState,
        shouldLoadMore: prefetch
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [overrideOptionsAfterFetch, setOverrideOptionsAfterFetch, resetOverrideOptionsAfterFetch] = useBoolean();

    function loadMore() {
        setLoading(true);

        function dispatchEndFetchAction() {
            dispatchFetchAction({ type: fetchActionType.END_FETCH });
        }

        function onFetchFailed(error) {
            dispatchEndFetchAction();
            log.error(error);
        }

        function onFetchFinished() {
            setLoading(false);
        }

        if (fetchAll) {
            toolbox
                .getManager()
                .doGetFull(fetchUrl)
                .then(data => {
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
                    _search: searchQuery,
                    _sort: valueProp,
                    _size: pageSize,
                    _offset: nextPage * pageSize
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

                    setOptions([...(overrideOptionsAfterFetch ? [] : options), ...itemsFormatter(data.items)]);
                    resetOverrideOptionsAfterFetch();
                })
                .catch(onFetchFailed)
                .finally(onFetchFinished);
        }
    }

    useEffect(() => {
        if (fetchState.shouldLoadMore && !disabled) loadMore();
    }, [fetchState.shouldLoadMore, disabled]);

    useEventListener(toolbox, refreshEvent, () =>
        dispatchFetchAction({ type: fetchActionType.PREPARE_FOR_INITIAL_FETCH })
    );

    useEffect(() => {
        if (_.isEmpty(value)) {
            setOptions(_.reject(options, 'implicit'));
        } else {
            const optionsToAdd = [];
            _.castArray(value).forEach(singleValue => {
                if (!_.find(options, { [valueProp]: singleValue })) {
                    optionsToAdd.push({ [valueProp]: singleValue, implicit: true });
                }
            });
            if (optionsToAdd.length > 0) {
                setOptions([...optionsToAdd, ...options]);
            }
        }
    }, [value]);

    useFetchTrigger(
        resetOptions => {
            if (resetOptions) setOverrideOptionsAfterFetch();
            dispatchFetchAction({ type: fetchActionType.TRIGGER_FETCH });
        },
        [searchQuery],
        [fetchUrl]
    );

    const filteredOptions = _(options)
        .filter(option =>
            _(filter)
                .mapValues(v => toolbox.getContext().getValue(v))
                .map((v, k) => _.isEmpty(v) || _.isEmpty(option[k]) || _.includes(v, option[k]))
                .every(Boolean)
        )
        .uniqBy(valueProp)
        .value();

    function getDropdownValue() {
        if (!value) {
            return multiple ? [] : '';
        }

        let valueArray = _.castArray(value);

        if (!fetchState.hasMore) {
            const filteredValueArray = _(filteredOptions).map(valueProp).intersection(valueArray).value();
            if (filteredValueArray.length !== valueArray.length) {
                onChange(filteredValueArray);
                valueArray = filteredValueArray;
            }
        }

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
                onAddItem={(event, data) => {
                    if (allowAdditions) setOptions([{ [valueProp]: data.value }, ...options]);
                }}
                onChange={(event, data) => onChange(!_.isEmpty(data.value) ? data.value : null)}
                onSearchChange={(event, data) => {
                    setSearchQuery(data.searchQuery);
                    if (isFunction(onSearchChange)) onSearchChange(event, data);
                }}
                multiple={multiple}
                loading={isLoading}
                options={(() => {
                    const preparedOptions = filteredOptions.map(item => ({
                        text: (textFormatter || (i => i[valueProp]))(item),
                        value: item[valueProp]
                    }));
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
                /* eslint-disable-next-line react/jsx-props-no-spreading */
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

Stage.defineCommon({
    name: 'DynamicDropdown',
    common: DynamicDropdown
});
