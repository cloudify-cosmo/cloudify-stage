/* eslint-disable react/no-array-index-key */
import React from 'react';

const renderMultilineText = (text: string, useLineBreakElement = true) => {
    const newLineCharacter = '\n';

    if (text.indexOf(newLineCharacter) === -1) {
        return text;
    }

    if (useLineBreakElement) {
        return text.split(newLineCharacter).map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    }

    return text.split(newLineCharacter).map((line, index) => <p key={index}>{line}</p>);
};
export default renderMultilineText;
