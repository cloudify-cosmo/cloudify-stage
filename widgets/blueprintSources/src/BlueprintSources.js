/**
 * Created by pposel on 28/02/2017.
 */
import SplitterLayout from 'react-splitter-layout';
import Actions from './actions';

export default class BlueprintSources extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = BlueprintSources.initialState;
    }

    static initialState = {
        content: '',
        filename: '',
        error: '',
        type: 'json'
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentDidUpdate(prevProps) {
        const { data } = this.props;
        if (prevProps.data !== data) {
            this.setState(BlueprintSources.initialState);
        }
    }

    selectFile(selectedKeys, info) {
        const { toolbox } = this.props;
        if (_.isEmpty(selectedKeys) || !_.isEmpty(info.node.props.children)) {
            this.setState({ content: '', filename: '' });
            return;
        }

        const path = selectedKeys[0];

        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetFileContent(path)
            .then(data => {
                let type = 'json';
                if (_.endsWith(path, '.yaml') || _.endsWith(path, '.yml')) {
                    type = 'yaml';
                } else if (_.endsWith(path, '.py')) {
                    type = 'python';
                } else if (_.endsWith(path, '.sh')) {
                    type = 'bash';
                }

                toolbox.loading(false);

                this.setState({ content: data, filename: info.node.props.title.props.children[1], type, error: '' });
            })
            .catch(err => {
                this.setState({ error: err.message, content: '', filename: '' });
                toolbox.loading(false);
            });
    }

    render() {
        const { data, widget } = this.props;
        const { content, error, filename, maximized, type } = this.state;
        const { NodesTree, Message, Label, Modal, HighlightText, ErrorMessage, Icon } = Stage.Basic;

        const loop = items => {
            return items.map(item => {
                if (item.children) {
                    return (
                        <NodesTree.Node
                            key={item.key}
                            title={
                                <span>
                                    <Icon className="treeIcon" name="folder open outline" />
                                    {item.title}
                                </span>
                            }
                        >
                            {loop(item.children)}
                        </NodesTree.Node>
                    );
                }
                const label =
                    data.yamlFileName === item.title ? (
                        <strong>
                            {item.title}
                            <Label color="blue" size="mini" style={{ marginLeft: 8 }}>
                                Main
                            </Label>
                        </strong>
                    ) : (
                        item.title
                    );
                return (
                    <NodesTree.Node
                        key={item.key}
                        title={
                            <span>
                                <Icon className="treeIcon" name="file outline" />
                                {label}
                            </span>
                        }
                    />
                );
            });
        };

        return (
            <div>
                {!_.isEmpty(data.blueprintId) ? (
                    <SplitterLayout
                        primaryIndex={0}
                        percentage
                        secondaryInitialSize={widget.configuration.contentPaneWidth}
                    >
                        <div>
                            <NodesTree
                                className="nodes-tree"
                                showLine
                                selectable
                                defaultExpandAll
                                onSelect={this.selectFile.bind(this)}
                            >
                                <NodesTree.Node
                                    key="blueprint"
                                    disabled
                                    title={
                                        <Label color="purple" horizontal>
                                            {data.blueprintId}
                                        </Label>
                                    }
                                >
                                    {loop(data.blueprintTree.children)}
                                </NodesTree.Node>
                                {_.size(data.importedBlueprintIds) > 0 && (
                                    <NodesTree.Node
                                        key="imported"
                                        style={{ marginTop: '5px' }}
                                        disabled
                                        title={
                                            <Label color="pink" horizontal>
                                                Imported Blueprints
                                                <Label.Detail>({_.size(data.importedBlueprintIds)})</Label.Detail>
                                            </Label>
                                        }
                                    >
                                        {_.map(data.importedBlueprintTrees, (tree, index) => (
                                            <NodesTree.Node
                                                key={data.importedBlueprintIds[index]}
                                                style={{ marginTop: '3px' }}
                                                disabled
                                                title={
                                                    <Label color="pink" horizontal>
                                                        {data.importedBlueprintIds[index]}
                                                    </Label>
                                                }
                                            >
                                                {loop(tree.children)}
                                            </NodesTree.Node>
                                        ))}
                                    </NodesTree.Node>
                                )}
                            </NodesTree>
                        </div>
                        {content ? (
                            <div className="alignHighlight">
                                <HighlightText language={type}>{content}</HighlightText>
                                <Label
                                    attached="top right"
                                    size="small"
                                    onClick={() => this.setState({ maximized: true })}
                                >
                                    <Icon name="expand" link />
                                    {filename}
                                </Label>
                                <Modal open={maximized} onClose={() => this.setState({ maximized: false })}>
                                    <HighlightText language={type}>{content}</HighlightText>
                                </Modal>
                            </div>
                        ) : (
                            <div className="verticalCenter centeredIcon">
                                <Icon name="file outline" size="big" color="grey" />
                            </div>
                        )}
                    </SplitterLayout>
                ) : (
                    <div>
                        <Message content="Please select blueprint to display source files" info />
                    </div>
                )}

                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />
            </div>
        );
    }
}
