import { shallow } from 'enzyme';

import getInputField from 'common/src/inputs/utils/getInputField';
import { DEFAULT_TEXTAREA_ROWS } from 'common/src/inputs/utils/consts';
import { noop } from 'lodash';
import { Form } from 'cloudify-ui-components';
import type { Input } from 'common/src/inputs/utils/types';

jest.mock('common/src/inputs/utils/getRevertToDefaultIcon', () => () => undefined);

describe('InputsUtils.getInputField', () => {
    let input: Input;
    const value = 'value';
    const onChange = noop;
    const error = false;

    beforeEach(() => {
        input = {
            name: 'name',
            default: 'defaultName',
            type: 'textarea',
            constraints: [],
            display: {
                rows: 5
            }
        };
    });

    it('Renders Textarea with default rows value', () => {
        delete input.display.rows;
        const wrapper = shallow(getInputField(input, value, onChange, error));
        const wrapperTextArea = wrapper.find(Form.TextArea);
        expect(wrapper.find(Form.TextArea)).toHaveLength(1);
        expect(wrapperTextArea.props().rows).toEqual(DEFAULT_TEXTAREA_ROWS);
    });

    it('Renders Textarea with appropriate rows prop', () => {
        const wrapper = shallow(getInputField(input, value, onChange, error));
        const wrapperTextArea = wrapper.find(Form.TextArea);
        expect(wrapperTextArea.props().rows).toEqual(5);
    });
});
