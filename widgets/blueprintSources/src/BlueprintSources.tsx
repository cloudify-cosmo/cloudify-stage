import { useEffect } from 'react';
import type { ComponentProps } from 'react';
import SplitterLayout from 'react-splitter-layout';
import Actions from './actions';

const { CancelButton, NodesTree, Message, Label, Modal, HighlightText, ErrorMessage, Icon } = Stage.Basic;
const { useResettableState, useBoolean } = Stage.Hooks;

type FileType = ComponentProps<typeof HighlightText>['language'];

interface NodeTreeItem {
    children?: NodeTreeItem[];
    key: string;
    title: string;
    isDir: boolean;
}

interface FileInfo {
    node: {
        props: {
            children: any;
            title: {
                props: {
                    children: React.SetStateAction<string>[];
                };
            };
        };
    };
}

interface BlueprintTree {
    children: NodeTreeItem[];
    key: string;
    title: string;
    isDir: boolean;
    timestamp: number;
}

interface BlueprintSourcesProps {
    data: {
        blueprintId: string;
        blueprintTree: BlueprintTree;
        importedBlueprintIds: string[];
        importedBlueprintTrees: BlueprintTree[];
        yamlFileName: string;
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget;
}

export default function BlueprintSources({ data, toolbox, widget }: BlueprintSourcesProps) {
    const [content, setContent, clearContent] = useResettableState('');
    const [filename, setFilename, clearFilename] = useResettableState('');
    const [error, setError, clearError] = useResettableState<string | null>(null);
    const [type, setType, resetType] = useResettableState<FileType>('json');
    const [isMaximized, maximize, minimize] = useBoolean();

    useEffect(() => {
        clearContent();
        clearFilename();
        clearError();
        resetType();
    }, [data]);

    function selectFile(selectedKeys: string[], info: FileInfo) {
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
                let fileType: FileType = 'json';
                if (_.endsWith(path.toLowerCase(), '.yaml') || _.endsWith(path.toLowerCase(), '.yml')) {
                    fileType = 'yaml';
                } else if (_.endsWith(path.toLowerCase(), '.py')) {
                    fileType = 'python';
                } else if (_.endsWith(path.toLowerCase(), '.sh')) {
                    fileType = 'bash';
                }

                setFilename(info.node.props.title.props.children[1]);
                setType(fileType);
                clearError();
            })
            .catch((err: Error) => {
                setError(err.message);
                clearContent();
                clearFilename();
            })
            .finally(() => toolbox.loading(false));
    }

    const loop = (blueprintId: string, timestamp: number, items: NodeTreeItem[]) => {
        return items.map(item => {
            const key = `${blueprintId}/file/${timestamp}/${item.key}`;
            if (item.children) {
                return (
                    // @ts-ignore NodesTree.Node is not migrated to typescript
                    <NodesTree.Node
                        key={key}
                        title={
                            <span>
                                <Icon className="treeIcon" name="folder open outline" />
                                {item.title}
                            </span>
                        }
                    >
                        {loop(blueprintId, timestamp, item.children)}
                    </NodesTree.Node>
                );
            }
            const blueprintRootDirectory = data.blueprintTree.children[0].key;
            const mainYamlFilePath = `${blueprintRootDirectory}/${data.yamlFileName}`;
            const label =
                mainYamlFilePath === item.key ? (
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
                // @ts-ignore NodesTree.Node is not migrated to typescript
                <NodesTree.Node
                    key={key}
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
                    secondaryInitialSize={widget.configuration.contentPaneWidth as number}
                >
                    <div>
                        <NodesTree className="nodes-tree" showLine selectable defaultExpandAll onSelect={selectFile}>
                            {/* @ts-ignore NodesTree.Node is not migrated to typescript */}
                            <NodesTree.Node
                                key="blueprint"
                                disabled
                                title={
                                    <Label color="purple" horizontal>
                                        {data.blueprintId}
                                    </Label>
                                }
                            >
                                {loop(data.blueprintId, data.blueprintTree.timestamp, data.blueprintTree.children)}
                            </NodesTree.Node>
                            {_.size(data.importedBlueprintIds) > 0 && (
                                // @ts-ignore NodesTree.Node is not migrated to typescript
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
                                    {_.map(data.importedBlueprintTrees, (tree, index: number) => (
                                        // @ts-ignore NodesTree.Node is not migrated to typescript
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
                                            {loop(data.importedBlueprintIds[index], tree.timestamp, tree.children)}
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
