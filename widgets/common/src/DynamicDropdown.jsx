// NOTE: Disabling react/require-default-props as default values are provided in component's definition
/* eslint-disable react/require-default-props */
import VisibilitySensor from 'react-visibility-sensor';
import './DynamicDropdown.css';

let instanceCount = 0;

export default function DynamicDropdown({
    fetchUrl,
    onChange,
    toolbox,
    className = '',
    disabled = false,
    fetchAll = false,
    filter = {},
    innerRef = null,
    itemsFormatter = _.identity,
    multiple = false,
    name = null,
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
    const { useBoolean, useEventListener, useUpdateEffect } = Stage.Hooks;

    const [id] = useState(() => {
        instanceCount += 1;
        return `dynamicDropdown${instanceCount}`;
    });
    const [options, setOptions] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(-1);
    const [searchQuery, setSearchQuery] = useState('');
    const [shouldLoadMore, setShouldLoadMore] = useState(prefetch);
    const [isLoading, setLoading] = useState(false);
    const [overrideOptionsAfterFetch, setOverrideOptionsAfterFetch, resetOverrideOptionsAfterFetch] = useBoolean();

    function unsetLoadingAndShouldLoadMore() {
        setLoading(false);
        setShouldLoadMore(false);
    }

    function loadMore() {
        setLoading(true);

        if (fetchAll) {
            toolbox
                .getManager()
                .doGetFull(fetchUrl)
                .then(data => {
                    setHasMore(false);
                    setOptions(itemsFormatter(data.items));
                })
                .finally(unsetLoadingAndShouldLoadMore);
        } else {
            const nextPage = currentPage + 1;

            toolbox
                .getManager()
                .doGet(fetchUrl, { _sort: valueProp, _size: pageSize, _offset: nextPage * pageSize })
                .then(data => {
                    setHasMore(data.metadata.pagination.total > (nextPage + 1) * pageSize);
                    setOptions([...(overrideOptionsAfterFetch ? [] : options), ...itemsFormatter(data.items)]);
                    resetOverrideOptionsAfterFetch();
                })
                .finally(unsetLoadingAndShouldLoadMore);

            setCurrentPage(nextPage);
        }
    }

    function refreshData() {
        setOverrideOptionsAfterFetch();
        setHasMore(true);
        setCurrentPage(-1);
    }

    useEffect(() => {
        if (shouldLoadMore && !disabled) loadMore();
    }, [shouldLoadMore, disabled]);

    useEventListener(toolbox, refreshEvent, refreshData);

    useEffect(() => {
        if (_.isEmpty(value)) {
            setOptions(_.reject(options, 'implicit'));
        } else {
            _.castArray(value).forEach(singleValue => {
                if (!_.find(options, { [valueProp]: singleValue })) {
                    setOptions([{ [valueProp]: singleValue, implicit: true }, ...options]);
                }
            });
        }
    }, [value]);

    useUpdateEffect(() => {
        refreshData();
        setShouldLoadMore(true);
    }, [fetchUrl]);

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

        if (!hasMore) {
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
                onChange={(event, field) => onChange(!_.isEmpty(field.value) ? field.value : null)}
                onSearchChange={(e, data) => setSearchQuery(data.searchQuery)}
                multiple={multiple}
                loading={isLoading}
                options={(() => {
                    const preparedOptions = filteredOptions.map(item => ({
                        text: (textFormatter || (i => i[valueProp]))(item),
                        value: item[valueProp]
                    }));
                    if (hasMore) {
                        preparedOptions.push({
                            disabled: true,
                            icon: (
                                <VisibilitySensor
                                    active={!isLoading}
                                    containment={document.querySelector(`#${id} .menu`)}
                                    partialVisibility
                                    onChange={setShouldLoadMore}
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
    innerRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }),
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    placeholder: PropTypes.string,
    fetchUrl: PropTypes.string.isRequired,
    fetchAll: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func.isRequired,
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
