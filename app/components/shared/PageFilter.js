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

    static initialState = props => ({
        pageId: props.value
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
        const { allowDrillDownPages, pages } = this.props;
        const { pageId } = this.state;
        const filteredPages = allowDrillDownPages ? pages : _.filter(pages, page => !page.isDrillDown);
        const pagesOptions = _.map(filteredPages, page => ({
            text: this.getPageName(filteredPages, page.id),
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

PageFilter.propTypes = {
    /**
     * name of the field
     */
    name: PropTypes.string.isRequired,

    /**
     * value of the field
     */
    // eslint-disable-next-line react/no-unused-prop-types
    value: PropTypes.string.isRequired,

    /**
     * array containing page objects
     */
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            isDrilldown: PropTypes.bool,
            name: PropTypes.string,
            parent: PropTypes.string
        })
    ).isRequired,

    /**
     *
     */
    allowDrillDownPages: PropTypes.bool,

    /**
     * function called on input value change
     */
    onChange: PropTypes.func
};

PageFilter.defaultProps = {
    allowDrillDownPages: false,
    onChange: _.noop
};

const mapStateToProps = state => {
    return {
        pages: state.pages
    };
};

export default connect(mapStateToProps)(PageFilter);
