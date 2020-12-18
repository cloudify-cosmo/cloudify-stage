import VisibilitySensor from 'react-visibility-sensor';
import './DynamicDropdown.css';

let instanceCount = 0;

function DynamicDropdown({
    multiple,
    placeholder,
    fetchUrl,
    fetchAll,
    value,
    onChange,
    toolbox,
    filter,
    valueProp,
    textFormatter,
    pageSize,
    name,
    prefetch,
    className,
    refreshEvent,
    ...rest
}) {
    const { useState, useEffect } = React;

    const [id] = useState(() => {
        instanceCount += 1;
        return `dynamicDropdown${instanceCount}`;
    });
    const [options, setOptions] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(-1);
    const [searchQuery, setSearchQuery] = useState('');
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);

    function isSimpleValue() {
        return valueProp === '';
    }

    function getValueProp() {
        return valueProp || 'id';
    }

    function loadMore() {
        setLoading(true);
        setLoaderVisible(null);

        if (fetchAll) {
            toolbox
                .getManager()
                .doGetFull(fetchUrl)
                .then(data => {
                    setHasMore(false);
                    setOptions(isSimpleValue() ? data.items.map(item => ({ id: item })) : data.items);
                })
                .finally(() => setLoading(false));
        } else {
            const nextPage = currentPage + 1;

            toolbox
                .getManager()
                .doGet(fetchUrl, { _sort: valueProp, _size: pageSize, _offset: nextPage * pageSize })
                .then(data => {
                    setHasMore(data.metadata.pagination.total > (nextPage + 1) * pageSize);
                    setOptions([
                        ...options,
                        ...(isSimpleValue() ? data.items.map(item => ({ id: item })) : data.items)
                    ]);
                })
                .finally(() => setLoading(false));

            setCurrentPage(nextPage);
        }
    }

    useEffect(() => {
        if (prefetch) loadMore();
    }, []);

    useEffect(() => {
        function refreshData() {
            setOptions([]);
            setHasMore(true);
            setCurrentPage(-1);
        }
        if (refreshEvent) {
            toolbox.getEventBus().on(refreshEvent, refreshData);
            return () => {
                toolbox.getEventBus().off(refreshEvent, refreshData);
            };
        }

        return undefined;
    }, []);

    useEffect(() => {
        if (_.isEmpty(value)) {
            setOptions(_.reject(options, 'implicit'));
        } else {
            _.castArray(value).forEach(singleValue => {
                if (!_.find(options, { [getValueProp()]: singleValue })) {
                    setOptions([{ [getValueProp()]: singleValue, implicit: true }, ...options]);
                }
            });
        }
    }, [value]);

    useEffect(() => {
        if (loaderVisible) {
            loadMore();
        }
    }, [loaderVisible]);

    useEffect(() => {
        loadMore();
    }, [fetchUrl]);

    const filteredOptions = _(options)
        .filter(option =>
            _(filter)
                .mapValues(v => toolbox.getContext().getValue(v))
                .map((v, k) => _.isEmpty(v) || _.isEmpty(option[k]) || _.includes(v, option[k]))
                .every(Boolean)
        )
        .uniqBy(getValueProp())
        .value();

    function getDropdownValue() {
        if (!value) {
            return multiple ? [] : '';
        }

        let valueArray = _.castArray(value);

        if (!hasMore) {
            const filteredValueArray = _(filteredOptions).map(getValueProp()).intersection(valueArray).value();
            const { allowAdditions } = rest;
            if (filteredValueArray.length !== valueArray.length && !allowAdditions) {
                onChange(filteredValueArray);
                valueArray = filteredValueArray;
            }
        }

        return multiple ? valueArray : valueArray[0];
    }

    const { Form, Loading } = Stage.Basic;

    return (
        <Form.Dropdown
            className={`dynamic ${className}`}
            search
            selection
            selectOnBlur={false}
            placeholder={placeholder}
            fluid
            value={getDropdownValue()}
            id={id}
            name={name}
            onChange={(proxy, field) => onChange(!_.isEmpty(field.value) ? field.value : null)}
            onSearchChange={(e, data) => setSearchQuery(data.searchQuery)}
            multiple={multiple}
            loading={isLoading}
            options={(() => {
                const preparedOptions = filteredOptions.map(item => ({
                    text: (textFormatter || (i => i[getValueProp()]))(item),
                    value: item[getValueProp()]
                }));
                if (hasMore) {
                    preparedOptions.push({
                        disabled: true,
                        icon: (
                            <VisibilitySensor
                                active={!isLoading}
                                containment={document.querySelector(`#${id} .menu`)}
                                partialVisibility
                                onChange={setLoaderVisible}
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
    );
}

DynamicDropdown.propTypes = {
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
    refreshEvent: PropTypes.string
};

DynamicDropdown.defaultProps = {
    value: null,
    fetchAll: false,
    filter: {},
    valueProp: 'id',
    textFormatter: null,
    pageSize: 10,
    placeholder: null,
    name: null,
    prefetch: false,
    multiple: false,
    className: '',
    refreshEvent: null
};

Stage.defineCommon({
    name: 'DynamicDropdown',
    common: DynamicDropdown
});
