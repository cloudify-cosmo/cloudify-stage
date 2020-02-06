import { useState, useEffect } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

export default function Dropdown({
    configuration,
    entityName,
    fetchUrl,
    fetchAll,
    value,
    onChange,
    toolbox,
    filter,
    enabledConfigurationKey,
    valueProp,
    textFormatter,
    pageSize
}) {
    const [options, setOptions] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(-1);
    const [searchQuery, setSearchQuery] = useState('');
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);

    function loadMore() {
        setLoading(true);
        setLoaderVisible(null);

        if (fetchAll) {
            toolbox
                .getManager()
                .doGetFull(fetchUrl)
                .then(data => {
                    setHasMore(false);
                    setOptions(data.items);
                    setLoading(false);
                });
        } else {
            const nextPage = currentPage + 1;

            toolbox
                .getManager()
                .doGet(fetchUrl, { _sort: valueProp, _size: pageSize, _offset: nextPage * pageSize })
                .then(data => {
                    setHasMore(data.metadata.pagination.total > (nextPage + 1) * pageSize);
                    setOptions([...options, ...data.items]);
                    setLoading(false);
                });

            setCurrentPage(nextPage);
        }
    }

    useEffect(() => {
        if (loaderVisible) {
            loadMore();
        }
    }, [loaderVisible]);

    const filteredOptions = _(options)
        .filter(option =>
            _(filter)
                .mapValues(v => toolbox.getContext().getValue(v))
                .map((v, k) => _.isEmpty(v) || _.includes(v, option[k]))
                .every(Boolean)
        )
        .uniqBy(valueProp)
        .value();

    function getDropdownValue(value) {
        const { allowMultipleSelection } = configuration;

        if (!value) {
            return allowMultipleSelection ? [] : '';
        }

        let valueArray = _.castArray(value);

        if (!hasMore) {
            const filteredValueArray = _(filteredOptions)
                .map(valueProp)
                .intersection(valueArray)
                .value();
            if (filteredValueArray.length !== valueArray.length) {
                onChange(filteredValueArray);
                valueArray = filteredValueArray;
            }
        }

        return allowMultipleSelection ? valueArray : valueArray[0];
    }

    const joinedEntityName = entityName.replace(' ', '');
    if (configuration[`filterBy${enabledConfigurationKey || `${joinedEntityName}s`}`]) {
        const { Form, Loading } = Stage.Basic;
        const id = `${_.lowerCase(joinedEntityName)}FilterField`;
        const { allowMultipleSelection } = configuration;

        return (
            <Form.Field>
                <Form.Dropdown
                    search
                    selection
                    selectOnBlur={false}
                    placeholder={entityName}
                    fluid
                    value={getDropdownValue(value)}
                    id={id}
                    onChange={(proxy, field) => onChange(!_.isEmpty(field.value) ? field.value : null)}
                    onSearchChange={(e, data) => setSearchQuery(data.searchQuery)}
                    multiple={allowMultipleSelection}
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
                ></Form.Dropdown>
            </Form.Field>
        );
    }

    return null;
}

Dropdown.propTypes = {
    configuration: PropTypes.shape({}).isRequired,
    entityName: PropTypes.string.isRequired,
    fetchUrl: PropTypes.string.isRequired,
    fetchAll: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func.isRequired,
    toolbox: PropTypes.shape({}).isRequired,
    filter: PropTypes.shape({}),
    enabledConfigurationKey: PropTypes.string,
    valueProp: PropTypes.string,
    textFormatter: PropTypes.func,
    pageSize: PropTypes.number
};

Dropdown.defaultProps = {
    value: null,
    fetchAll: false,
    filter: {},
    enabledConfigurationKey: null,
    valueProp: 'id',
    textFormatter: null,
    pageSize: 10
};
