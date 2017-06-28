/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component } from 'react';
import {Form} from 'semantic-ui-react';

export default class TableSearch extends Component {

    render() {
        return (
            <Form.Field>
                <Form.Input icon="search" placeholder="Search..." />
            </Form.Field>
        );
    }
}