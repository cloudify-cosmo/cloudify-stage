/**
 * Created by jakub.niezgoda on 24/04/2018.
 */

import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

class MenuItem extends Menu.Item {
    render() {
        return <Menu.Item {...this.props} option-value={this.props.name} />;
    }
}

export default class extends Menu {
    static Item = MenuItem;
}
