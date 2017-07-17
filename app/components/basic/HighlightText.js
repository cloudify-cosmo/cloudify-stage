/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import Highlight from 'react-highlight';

/**
 * HighlightText component displays code with language-specific keyword highlighting
 *
 * ## Supported languages
 * HighlightText is based of [highlightJS](https://highlightjs.org/) and supports all major programming languages such as:
 * - Java
 * - JavaScript
 * - PHP
 * - C++
 * - C#
 * - Python
 * - Bash
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
 * <HighlightText className="JavaScript" children={"if ( arguments.length == 0 ) \n   console.log('undefined');"}/>
 *```
 *
 * ### HighlightText (Java)
 *
 * ![HighlightText](manual/asset/highlightText/HighlightText_1.png)
 * ```
 * <HighlightText className="Java" children={[
 * "public static final Short ERROR = 0x0001;\n",
 * "\n",
 * "public void moveTo(int x, int y, int z) {\n",
 * "   // Do something\n",
 * "   return\n",
 * "}"
 * ]}/>
 *```
 */
export default class HighlightText extends Component {

    /**
     * @property {object[]} [children] Text to be displayed
     * @property {string} [className=''] Language name (used for code highlighting)
     */
    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string
    };

    static defaultProps = {
        className: '',
    };

    render() {
        return <Highlight className={this.props.className}>{this.props.children}</Highlight>;
    }
}
 