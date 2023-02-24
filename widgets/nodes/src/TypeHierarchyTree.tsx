import type { TypeHierarchy } from './types';

const { Icon, NodesTree } = Stage.Basic;

interface TypeHierarchyProps {
    typeHierarchy: TypeHierarchy;
}

function getNodes(typeHierarchy: TypeHierarchy) {
    const firstType = typeHierarchy[0];

    return typeHierarchy.length > 1 ? (
        <NodesTree.Node
            key={firstType}
            title={
                <span>
                    <Icon name="triangle down" />
                    {firstType}
                </span>
            }
        >
            {getNodes(typeHierarchy.slice(1))}
        </NodesTree.Node>
    ) : (
        <NodesTree.Node
            key={firstType}
            title={
                <span>
                    <strong>{firstType}</strong>
                </span>
            }
        />
    );
}

export default function TypeHierarchyTree({ typeHierarchy }: TypeHierarchyProps) {
    return (
        <NodesTree showLine selectable={false} defaultExpandAll className="typesHierarchy">
            {getNodes(typeHierarchy)}
        </NodesTree>
    );
}
