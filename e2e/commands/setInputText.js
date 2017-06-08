/**
 * Created by jakubniezgoda on 06/06/2017.
 */

exports.command = function (field, value) {
    let input = field + ' div.input input';

    return this
        .clearValue(input)
        .setValue(input, value);
};