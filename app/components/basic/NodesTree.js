/**
 * Created by Alex on 22/02/2017.
 */

import 'rc-tree/assets/index.css';
import React, { Component, PropTypes } from 'react';
import Tree, { TreeNode } from 'rc-tree';

export default class NodesTree extends Component {

    static propTypes = Tree.propTypes;

    static defaultProps = {
        treeData: [],
        selectable: false,
        showIcon: false,
        showLine: true
    };

    render() {
        const loop = data => {
            return data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode key={item.key} title={item.title}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} title={item.title}/>;
            });
        };

        return this.props.treeData.length ?
               <Tree {...this.props}>
                   {loop(this.props.treeData)}
               </Tree> :
               <Stage.Basic.Loading/>;
    }
}
