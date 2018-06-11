/**
 * Created by jakubniezgoda on 21/05/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Form from './form/Form';

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
 */
class PageFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = PageFilter.initialState(props);
    }

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {string} value value of the field
     * @property {array} pages array containing page objects - {id, name} - it is fetched from redux store automatically
     * @property {function} [onChange=()=>{}] function called on input value change
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        pages: PropTypes.array.isRequired,
        onChange: PropTypes.func,
        allowDrillDownPages: PropTypes.bool
    };

    static initialState = (props) => ({
        pageId: props.value,
        allowDrillDownPages: false
    });

    _handleInputChange(event, field) {
        this.setState({pageId: field.value}, () => {
            this.props.onChange(event, {
                name: this.props.name,
                value: this.state.pageId
            })
        });
    }

    _getPageName(pages, pageId) {
        let page = _.find(pages, {id: pageId});
        if (page.isDrillDown) {
            return `${this._getPageName(pages, page.parent)} > ${page.name}`;
        } else {
            return page.name;
        }
    }

    render() {
        let pages = this.props.allowDrillDownPages
            ? this.props.pages
            : _.filter(this.props.pages, (page) => !page.isDrillDown);
        let pagesOptions
            = _.map(pages, (page) => ({
                    text: this._getPageName(pages, page.id),
                    value: page.id,
                    key: page.id
                }));
        pagesOptions.sort((a, b) => a.text.localeCompare(b.text));
        let defaultValue = pagesOptions[0].value;

        return (
            <Form.Dropdown name='pageId' search selection value={this.state.pageId || defaultValue}
                           options={pagesOptions} onChange={this._handleInputChange.bind(this)} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pages: state.pages
    };
};

export default connect(
    mapStateToProps
)(PageFilter);