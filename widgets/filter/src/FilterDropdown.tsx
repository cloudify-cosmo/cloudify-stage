import { lowerFirst } from 'lodash';
import type { DynamicDropdownProps } from 'app/widgets/common/components/DynamicDropdown';

interface FilterDropdownProps
    extends Pick<
        DynamicDropdownProps,
        | 'onChange'
        | 'fetchAll'
        | 'filter'
        | 'multiple'
        | 'pageSize'
        | 'searchParams'
        | 'textFormatter'
        | 'toolbox'
        | 'value'
        | 'valueProp'
    > {
    entityName: 'Blueprint' | 'Deployment' | 'Node' | 'Node Instance' | 'Execution' | 'Execution Status' | 'Site Name';
    fetchIncludeExtra?: string;
    fetchManagerEndpoint?: string;
    flushOnRefreshEvent?: boolean;
}

const FilterDropdown = ({
    entityName,
    onChange,
    fetchAll,
    fetchIncludeExtra,
    fetchManagerEndpoint,
    filter,
    flushOnRefreshEvent,
    multiple,
    pageSize,
    searchParams,
    textFormatter,
    toolbox,
    value,
    valueProp
}: FilterDropdownProps) => {
    const { Form } = Stage.Basic;
    const { DynamicDropdown } = Stage.Common.Components;
    const { appendQueryParam } = Stage.Utils.Url;

    const camelCaseEntityName = lowerFirst(entityName.replace(' ', ''));
    const url = `/${fetchManagerEndpoint || `${entityName.replace(' ', '-').toLowerCase()}s`}`;

    return (
        <Form.Field key={entityName}>
            <DynamicDropdown
                multiple={multiple}
                fetchUrl={appendQueryParam(url, {
                    _include: _(filter)
                        .keys()
                        .concat(valueProp || 'id')
                        .concat(fetchIncludeExtra || [])
                        .join()
                })}
                searchParams={searchParams}
                onChange={onChange}
                toolbox={toolbox}
                value={value}
                placeholder={entityName}
                fetchAll={fetchAll}
                textFormatter={textFormatter}
                valueProp={valueProp}
                pageSize={pageSize}
                filter={filter}
                className={`${camelCaseEntityName}FilterField`}
                refreshEvent={flushOnRefreshEvent ? `${camelCaseEntityName}s:refresh` : undefined}
            />
        </Form.Field>
    );
};

export default FilterDropdown;
