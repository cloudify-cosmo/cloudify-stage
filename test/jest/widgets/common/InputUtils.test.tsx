import React from 'react';
import { shallow } from 'enzyme';

import InputsUtils from 'common/src/InputsUtils';
import { noop } from 'lodash';
import { Form } from 'cloudify-ui-components';

describe('InputsUtils.getInputField', () => {
    let input: Record<string, any>;
    const value = 'value';
    const onChange = noop;
    const error = '';

    beforeEach(() => {
        input = {
            name: 'name',
            default: 'defaultName',
            type: 'textarea',
            constraints: '',
            display: {
                rows: 5
            }
        };
        InputsUtils.getRevertToDefaultIcon = () => undefined;
    });

    it('Renders Textarea with default rows value', () => {
        delete input.display.rows;
        const wrapper = shallow(InputsUtils.getInputField(input, value, onChange, error));
        const wrapperTextArea = wrapper.find(Form.TextArea);
        expect(wrapper.find(Form.TextArea)).toHaveLength(1);
        expect(wrapperTextArea.props().rows).toEqual(InputsUtils.DEFAULT_TEXTAREA_ROWS);
    });

    it('Renders Textarea with appropriate rows prop', () => {
        const wrapper = shallow(InputsUtils.getInputField(input, value, onChange, error));
        const wrapperTextArea = wrapper.find(Form.TextArea);
        expect(wrapperTextArea.props().rows).toEqual(5);
    });
});
