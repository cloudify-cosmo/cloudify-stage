/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';

export default class TableSearch extends Component {
    static propTypes = {
        search: PropTypes.string.isRequired,
        onSearch: PropTypes.func.isRequired,
        searching: PropTypes.bool
    };

    static defaultProps = {
        searching: false
    };

    render() {
        return (
            <Form.Field>
                <Form.Input
                    icon="search"
                    placeholder="Search..."
                    value={this.props.search}
                    onChange={e => {
                        this.props.onSearch(e.target.value);
                    }}
                    loading={this.props.searching}
                />
            </Form.Field>
        );
    }
}
