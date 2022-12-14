import React from 'react';
import { List } from '../../../components/basic';

const InputsHelpDescription = () => {
    return (
        <div>
            <p>Values are casted to types:</p>
            <List bulleted>
                <List.Item>
                    <strong>524</strong> or <strong>3.14</strong> will be casted to a number
                </List.Item>
                <List.Item>
                    <strong>false</strong> will be casted to a boolean
                </List.Item>
                <List.Item>
                    <strong>[1, 2]</strong> will be casted to an array
                </List.Item>
                <List.Item>
                    <strong>{'{"a":"b"}'}</strong> will be casted to an object
                </List.Item>
                <List.Item>
                    <strong>null</strong> will be casted to a null value
                </List.Item>
            </List>
            <p>Value is treated as string if it is not possible to cast it to a different type.</p>
            <p>
                Surround value with <strong>&quot;</strong> (double quotes) to explicitly declare it as a string, e.g.:
                <br />
                <strong>&quot;true&quot;</strong> will be treated as a string, not a boolean value.
            </p>
            <p>
                Use <strong>&quot;&quot;</strong> for an empty string.
            </p>
        </div>
    );
};

export default InputsHelpDescription;
