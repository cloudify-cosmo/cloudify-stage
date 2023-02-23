import type { TypeHierarchy } from './types';

interface TypeHierarchyTreeProps {
    typeHierarchy: TypeHierarchy;
}

export default function TypeHierarchyTree({ typeHierarchy }: TypeHierarchyTreeProps) {
    const { Icon, NodesTree } = Stage.Basic;

    const getNodes = (hierarchy: TypeHierarchy) => {
        const firstType = hierarchy[0];
        if (hierarchy.length > 1) {
            return (
                <NodesTree.Node
                    key={firstType}
                    title={
                        <span>
                            <Icon name="triangle down" />
                            {firstType}
                        </span>
                    }
                >
                    {getNodes(hierarchy.slice(1))}
                </NodesTree.Node>
            );
        }
        return (
            <NodesTree.Node
                key={firstType}
                title={
                    <span>
                        <strong>{firstType}</strong>
                    </span>
                }
            />
        );
    };

    return (
        <NodesTree showLine selectable={false} defaultExpandAll className="typesHierarchy">
            {getNodes(typeHierarchy)}
        </NodesTree>
    );
}
