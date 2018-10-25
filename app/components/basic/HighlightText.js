/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import Highlight, { registerLanguage } from 'react-syntax-highlighter/light';
import idea from 'react-syntax-highlighter/styles/hljs/idea';

import bash from 'react-syntax-highlighter/languages/hljs/bash';
import javascript from 'react-syntax-highlighter/languages/hljs/javascript';
import json from 'react-syntax-highlighter/languages/hljs/json';
import python from 'react-syntax-highlighter/languages/hljs/python';
import yaml from 'react-syntax-highlighter/languages/hljs/yaml';

registerLanguage('bash', python);
registerLanguage('javascript', javascript);
registerLanguage('json', json);
registerLanguage('python', python);
registerLanguage('yaml', yaml);

/**
 * HighlightText component displays code with language-specific keyword highlighting
 *
 * ## Supported languages
 * HighlightText is based of [highlightJS](https://highlightjs.org/) and supports the following languages/notations:
 * - Bash
 * - JavaScript
 * - JSON
 * - Python
 * - YAML
 *
 * ## Access
 * `Stage.Basic.HighlightText`
 *
 * ## Usage
 *
 * ### HighlightText (JavaScript)
 *
 * ![HighlightText](manual/asset/highlightText/HighlightText_0.png)
 * ```
 * <HighlightText className="javascript" children={"if ( arguments.length == 0 ) \n   console.log('undefined');"}/>
 *```
 */
export default class HighlightText extends Component {

    /**
     * @property {object[]} [children] Text to be displayed
     * @property {string} [className='json'] Language name (used for code highlighting)
     */
    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string
    };

    static defaultProps = {
        className: 'json',
    };

    render() {
        return (
            <Highlight language={this.props.className} style={idea}
                       codeTagProps={{style: {whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}}>
                {this.props.children}
            </Highlight>
        );
    }
}
 