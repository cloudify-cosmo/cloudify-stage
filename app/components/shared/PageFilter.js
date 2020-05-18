/**
 * Created by jakubniezgoda on 21/05/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { Form } from '../basic';

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
 *
 * @param props
 */
class PageFilter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = PageFilter.initialState(props);
    }

    /**
     * propTypes
     *
     * @property {string} name name of the field
     * @property {string} value value of the field
     * @property {Array} pages array containing page objects - {id, name} - it is fetched from redux store automatically
     * @property {Function} [onChange=()=>{}] function called on input value change
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        pages: PropTypes.array.isRequired,
        onChange: PropTypes.func,
        allowDrillDownPages: PropTypes.bool
    };

    static initialState = props => ({
        pageId: props.value,
        allowDrillDownPages: false
    });

    handleInputChange(event, field) {
        const { name, onChange } = this.props;
        this.setState({ pageId: field.value }, () => {
            const { pageId: value } = this.state;
            onChange(event, { name, value });
        });
    }

    getPageName(pages, pageId) {
        const page = _.find(pages, { id: pageId });
        if (page.isDrillDown) {
            return `${this.getPageName(pages, page.parent)} > ${page.name}`;
        }
        return page.name;
    }

    render() {
        const { allowDrillDownPages } = this.props;
        const { pageId } = this.state;
        const pages = allowDrillDownPages ? pages : _.filter(pages, page => !page.isDrillDown);
        const pagesOptions = _.map(pages, page => ({
            text: this.getPageName(pages, page.id),
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
                onChange={this.handleInputChange.bind(this)}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        pages: state.pages
    };
};

export default connect(mapStateToProps)(PageFilter);
