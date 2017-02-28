/**
 * Created by Alex on 22/02/2017.
 */

import 'rc-tree/assets/index.css';
import React, { Component, PropTypes } from 'react';
import Tree, { TreeNode } from 'rc-tree';

export default class NodesTree extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            treeData: props.treeData,
            expandedKeys: props.expandedKeys,
            checkedKeys: props.checkedKeys,
            selectedKeys: props.selectedKeys
        };
    }

    static propTypes = {
        treeData: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.object)
        ]),

        autoExpandParent: PropTypes.bool,
        defaultExpandAll: PropTypes.bool,
        expandedKeys: PropTypes.arrayOf(PropTypes.string),
        defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
        onExpand: PropTypes.func,

        checkable: PropTypes.bool,
        checkStrictly: PropTypes.bool,
        checkedKeys: PropTypes.arrayOf(PropTypes.string),
        defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
        onCheck: PropTypes.func,

        selectable: PropTypes.bool,
        multiple: PropTypes.bool,
        selectedKeys: PropTypes.arrayOf(PropTypes.string),
        defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
        onSelect: PropTypes.func,

        draggable: PropTypes.bool,
        onDragStart: PropTypes.func,
        onDragEnter: PropTypes.func,
        onDragOver: PropTypes.func,
        onDragLeave: PropTypes.func,
        onDrop: PropTypes.func,
        onDragEnd: PropTypes.func,

        className: PropTypes.string,
        prefixCls: PropTypes.string,
        showIcon: PropTypes.bool,
        showLine: PropTypes.bool,

        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,

        onRightClick: PropTypes.func
    };

    static defaultProps = {
        treeData: [],

        autoExpandParent: true,
        defaultExpandAll: false,
        expandedKeys: [],
        defaultExpandedKeys: [],
        onExpand: () => true,

        checkable: false,
        checkStrictly: false,
        checkedKeys: [],
        defaultCheckedKeys: [],
        onCheck: () => true,

        selectable: false,
        multiple: false,
        selectedKeys: [],
        defaultSelectedKeys: [],
        onSelect: () => true,

        draggable: false,
        onDragStart: () => true,
        onDragEnter: () => true,
        onDragOver: () => true,
        onDragLeave: () => true,
        onDrop: () => true,
        onDragEnd: () => true,

        className: '',
        prefixCls: 'rc-tree',
        showIcon: false,
        showLine: true,

        onMouseEnter: () => true,
        onMouseLeave: () => true,

        onRightClick: () => true
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

        return this.state.treeData.length ?
               <Tree {...this.props}>
                   {loop(this.state.treeData)}
               </Tree> :
               <Stage.Basic.Loading/>;
    }
}
