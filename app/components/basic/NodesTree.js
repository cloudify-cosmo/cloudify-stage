/**
 * Created by Alex on 22/02/2017.
 */

import 'rc-tree/assets/index.css';
import React, { Component, PropTypes } from 'react';
import Tree, { TreeNode } from 'rc-tree';

/**
 * NodesTree is a tree component, it wraps [rc-tree](http://react-component.github.io/tree/) component.
 *
 * See [rc-tree](http://react-component.github.io/tree/) component for details about props and detailed usage information.
 *
 * ## Access
 * `Stage.Basic.NodesTree`
 *
 * ## Usage
 *
 * ### Simple example
 * ![NodesTree_0](manual/asset/NodesTree_0.png)
 *
 * ```
 * <NodesTree defaultExpandAll>
 *   <NodesTree.Node title='root' key="0">
 *     <NodesTree.Node title='1' key="1"></NodesTree.Node>
 *     <NodesTree.Node title='2' key="2">
 *       <NodesTree.Node title='5' key="5"></NodesTree.Node>
 *       <NodesTree.Node title='6' key="6"></NodesTree.Node>
 *     </NodesTree.Node>
 *     <NodesTree.Node title='3' key="3"></NodesTree.Node>
 *     <NodesTree.Node title='4' key="4">
 *       <NodesTree.Node title='7' key="7"></NodesTree.Node>
 *     </NodesTree.Node>
 *   </NodesTree.Node>
 * </NodesTree>
 * ```
 *
 * ### Customized tree used for blueprints archive content view
 * ![NodesTree_1](manual/asset/NodesTree_1.png)
 * ```
 * const loop = data => {
 *   return data.map(item => {
 *     if (item.children) {
 *       return (
 *         <NodesTree.Node key={item.key}
 *                         title={<span><Icon className="treeIcon" name="folder open outline"/>{item.title}</span>}>
 *           {loop(item.children)}
 *         </NodesTree.Node>
 *       );
 *     }
 *     return <NodesTree.Node key={item.key}
 *                            title={<span><Icon className="treeIcon" name="file outline"/>{item.title}</span>}/>;
 *   });
 * };
 *
 * return (
 *   <NodesTree showLine selectable defaultExpandAll onSelect={this._selectFile.bind(this)}>
 *     <NodesTree.Node title={<Label color='purple' horizontal>{this.props.data.blueprintId}</Label>} key="0">
 *       {loop(this.props.data.tree.children)}
 *     </NodesTree.Node>
 *   </NodesTree>
 * );
 * ```
 */
export default class NodesTree extends Component {

    static Node = TreeNode;

    static propTypes = Tree.propTypes;

    /**
     * propTypes
     *
     * All propTypes are available at [rc-tree](http://react-component.github.io/tree/).
     *
     * In the table below only overridden props are listed.
     *
     * @property {object[]} [treeData=[]] primary content, alternative to adding tree nodes as children
     * @property {boolean} [selectable=false] specifies whether tree node can be selected
     * @property {boolean} [showIcon=false] specifies whether show icon on the left side of node
     * @property {boolean} [showLine=true] specifies whether show line connecting nodes on the same level
     */
    static defaultProps = {
        treeData: [],
        selectable: false,
        showIcon: false,
        showLine: true
    };

    render() {
        if (!_.isEmpty(this.props.children)) {
            return (
                <Tree {...this.props} className={`nodes-tree ${this.props.className}`}>
                    {this.props.children}
                </Tree>
            )
        } else {
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
                <Tree {...this.props} className={`nodes-tree ${this.props.className}`}>
                    {loop(this.props.treeData)}
                </Tree> :
                <Stage.Basic.Loading/>;
        }
    }
}
