import { map, noop, pickBy } from 'lodash';
import PropTypes from 'prop-types';
import React, { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import { DropdownProps } from 'semantic-ui-react';
import type { PageDefinition } from '../../actions/page';
import { createPagesMap } from '../../actions/pageMenu';
import type { ReduxState } from '../../reducers';

import { Form } from '../basic';

type PageFilterProps = Pick<Stage.Types.CustomConfigurationComponentProps<string>, 'name' | 'onChange' | 'value'> & {
    allowDrillDownPages?: boolean;
};

/**
 * PageFilter  - a component showing dropdown with list of currently available pages.
 *
 * ## Access
 * `Stage.Basic.PageFilter`
 *
 * ## Usage
 * ![PageFilter](manual/asset/PageFilter_0.png)
 *
 * ```
 * let value = 'dashboard';
 * <PageFilter name='pageId' value={value} />
 * ```
 */
const PageFilter: FunctionComponent<PageFilterProps> = ({
    allowDrillDownPages = false,
    name,
    onChange = noop,
    value
}) => {
    const filteredPagesMap = useSelector((state: ReduxState) => {
        const pagesMap = createPagesMap(state.pages);
        return allowDrillDownPages ? pagesMap : pickBy(pagesMap, page => !page.isDrillDown);
    });
    const [pageId, setPageId] = useState(value);

    function getPageName(id: PageDefinition['id']): string {
        // NOTE: assumes the page is always found
        const page = filteredPagesMap[id];
        if (page.isDrillDown) {
            // NOTE: assumes the drilldown page always have a parent set
            return `${getPageName(page.parent!)} > ${page.name}`;
        }
        return page.name;
    }

    const handleInputChange: DropdownProps['onChange'] = (event, field) => {
        const fieldValue = field.value as string;
        setPageId(fieldValue);
        onChange(event, { name, value: fieldValue });
    };

    const pagesOptions = map(filteredPagesMap, page => ({
        text: getPageName(page.id),
        value: page.id,
        key: page.id
    }));
    pagesOptions.sort((a, b) => a.text.localeCompare(b.text));
    const defaultValue = pagesOptions[0].value;

    return (
        <Form.Dropdown
            name="pageId"
            search
            selection
            value={pageId || defaultValue}
            options={pagesOptions}
            onChange={handleInputChange}
        />
    );
};

PageFilter.propTypes = {
    /**
     * name of the field
     */
    name: PropTypes.string.isRequired,

    /**
     * value of the field
     */
    value: PropTypes.string.isRequired,

    allowDrillDownPages: PropTypes.bool,

    /**
     * function called on input value change
     */
    onChange: PropTypes.func as any
};

export default PageFilter;
