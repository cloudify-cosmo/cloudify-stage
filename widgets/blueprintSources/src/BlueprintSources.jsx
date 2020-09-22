/**
 * Created by pposel on 28/02/2017.
 */
import SplitterLayout from 'react-splitter-layout';
import Actions from './actions';

export default function BlueprintSources({ data, toolbox, widget }) {
    const { useResetableState, useBoolean } = Stage.Hooks;
    const { useEffect } = React;

    const [content, setContent, clearContent] = useResetableState('');
    const [filename, setFilename, clearFilename] = useResetableState('');
    const [error, setError, clearError] = useResetableState('');
    const [type, setType, resetType] = useResetableState('json');
    const [isMaximized, maximize, minimize] = useBoolean();

    useEffect(() => {
        clearContent();
        clearFilename();
        clearError();
        resetType();
    }, [data]);

    function selectFile(selectedKeys, info) {
        if (_.isEmpty(selectedKeys) || !_.isEmpty(info.node.props.children)) {
            clearContent();
            clearFilename();
            return;
        }

        const path = selectedKeys[0];

        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetFileContent(path)
            .then(setContent)
            .then(() => {
                let fileType = 'json';
                if (_.endsWith(path, '.yaml') || _.endsWith(path, '.yml')) {
                    fileType = 'yaml';
                } else if (_.endsWith(path, '.py')) {
                    fileType = 'python';
                } else if (_.endsWith(path, '.sh')) {
                    fileType = 'bash';
                }

                setFilename(info.node.props.title.props.children[1]);
                setType(fileType);
                clearError();
            })
            .catch(err => {
                setError(err.message);
                clearContent();
                clearFilename();
            })
            .finally(() => toolbox.loading(false));
    }

    const { CancelButton, NodesTree, Message, Label, Modal, HighlightText, ErrorMessage, Icon } = Stage.Basic;

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
                        <NodesTree className="nodes-tree" showLine selectable defaultExpandAll onSelect={selectFile}>
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
                            <Label attached="top right" size="small" onClick={maximize}>
                                <Icon name="expand" link />
                                {filename}
                            </Label>
                            <Modal open={isMaximized} onClose={minimize}>
                                <Modal.Header>{filename}</Modal.Header>
                                <Modal.Content>
                                    <HighlightText language={type}>{content}</HighlightText>
                                </Modal.Content>
                                <Modal.Actions>
                                    <CancelButton content="Close" onClick={minimize} />
                                </Modal.Actions>
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

            <ErrorMessage error={error} onDismiss={() => setError(null)} autoHide />
        </div>
    );
}

BlueprintSources.propTypes = {
    data: PropTypes.shape({
        blueprintId: PropTypes.string,
        blueprintTree: PropTypes.shape({ children: PropTypes.arrayOf(PropTypes.shape({})) }),
        importedBlueprintIds: PropTypes.arrayOf(PropTypes.string),
        importedBlueprintTrees: PropTypes.arrayOf(PropTypes.shape({})),
        yamlFileName: PropTypes.string
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
