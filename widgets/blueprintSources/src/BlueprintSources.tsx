import type { NodesTreeProps } from 'cloudify-ui-components';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import SplitterLayout from 'react-splitter-layout';
import styled from 'styled-components';
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

interface BlueprintTree {
    children: NodeTreeItem[];
    key: string;
    title: string;
    isDir: boolean;
    timestamp: number;
}

const StyledHighlightText = styled(HighlightText)`
    margin-top: 2rem;
    margin-bottom: 0rem;
`;

const Center = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const Bold = styled.span`
    font-weight: bold;
`;

interface RightPaneProps {
    imageUrl: string;
    isBinary: boolean;
    content: string;
    filename: string;
    type: FileType;
    maximize: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    isMaximized: boolean;
    minimize: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const RightPane = ({
    imageUrl,
    isBinary,
    content,
    filename,
    type,
    maximize,
    isMaximized,
    minimize
}: RightPaneProps) => {
    const t = Stage.Utils.getT('widgets.blueprintSources');

    if (imageUrl) {
        return (
            <Center>
                <img src={imageUrl} alt={filename} />
            </Center>
        );
    }

    if (isBinary) {
        return <Center>{t('binaryFile')}</Center>;
    }

    if (content) {
        return (
            <div>
                <StyledHighlightText language={type}>{content}</StyledHighlightText>
                <Label attached="top right" size="small" onClick={maximize} style={{ cursor: 'pointer' }}>
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
        );
    }

    return (
        <Center>
            <Bold>{t('thisIsAFolder')}</Bold>
            {t('nothingToShow')}
        </Center>
    );
};

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
    const [imageUrl, setImageUrl, clearImageUrl] = useResettableState('');
    const [isBinary, setBinary, unsetBinary] = useBoolean(false);
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

    const selectFile: NodesTreeProps['onSelect'] = (selectedKeys, info) => {
        if (_.isEmpty(selectedKeys) || !_.isEmpty(info.node.children)) {
            clearContent();
            clearFilename();
            return;
        }

        const path = selectedKeys[0] as string;
        const isImage = path.match(/.(jpg|jpeg|png|gif|ico)$/i);

        unsetBinary();
        clearImageUrl();
        if (isImage) {
            setImageUrl(`/console/source/browse/${path}`);
        }

        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetFileContent(path)
            .then((response: string | null) => {
                if (isImage) {
                    clearContent();
                } else if (typeof response === 'string') {
                    setContent(response as string);
                } else {
                    setBinary();
                }
            })
            .then(() => {
                let fileType: FileType = 'json';
                if (Stage.Utils.isYamlFile(path)) {
                    fileType = 'yaml';
                } else if (_.endsWith(path.toLowerCase(), '.py')) {
                    fileType = 'python';
                } else if (_.endsWith(path.toLowerCase(), '.sh')) {
                    fileType = 'bash';
                }
                const propsTitle = info.node.title as JSX.Element;
                setFilename(propsTitle.props.children[1]);
                setType(fileType);
                clearError();
            })
            .catch((err: Error) => {
                setError(err.message);
                clearContent();
                clearFilename();
            })
            .finally(() => toolbox.loading(false));
    };

    const loop = (blueprintId: string, timestamp: number, items: NodeTreeItem[]) => {
        return items.map(item => {
            const key = `${blueprintId}/file/${timestamp}/${item.key}`;
            if (item.children) {
                return (
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
                        <Label color="blue" size="mini" style={{ marginLeft: 8, position: 'relative', top: -2 }}>
                            Main
                        </Label>
                    </strong>
                ) : (
                    item.title
                );
            return (
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
                    <RightPane {...{ imageUrl, isBinary, content, filename, type, maximize, isMaximized, minimize }} />
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
