import type { TypeHierarchy } from './types';

interface TypeHierarchyTreeProps {
    typeHierarchy: TypeHierarchy;
}

export default function TypeHierarchyTree({ typeHierarchy }: TypeHierarchyTreeProps) {
    const { Icon, NodesTree } = Stage.Basic;

    const getNodes = (hierarchy: TypeHierarchy) => {
        const type = hierarchy[0];
        if (hierarchy.length > 1) {
            return (
                <NodesTree.Node
                    key={type}
                    title={
                        <span>
                            <Icon name="triangle down" />
                            {type}
                        </span>
                    }
                >
                    {getNodes(hierarchy.slice(1))}
                </NodesTree.Node>
            );
        }
        return (
            <NodesTree.Node
                key={type}
                title={
                    <span>
                        <strong>{type}</strong>
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
