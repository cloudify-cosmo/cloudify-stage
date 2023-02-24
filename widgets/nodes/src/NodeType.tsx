import { icons } from 'cloudify-ui-common-frontend';

interface NodeTypeIconProps {
    typeHierarchy: string[];
}

export default function NodeTypeIcon({ typeHierarchy }: NodeTypeIconProps) {
    const icon = icons.getNodeIcon(_.reverse(_.clone(typeHierarchy)));

    return <span style={{ fontSize: 20, fontFamily: 'cloudify' }}>{icon}</span>;
}
