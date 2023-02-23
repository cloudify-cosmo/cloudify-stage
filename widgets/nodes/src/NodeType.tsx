import { icons } from 'cloudify-ui-common-frontend';
import type { TypeHierarchy } from './types';

interface NodeTypeIconProps {
    typeHierarchy: TypeHierarchy;
}

export default function NodeTypeIcon({ typeHierarchy }: NodeTypeIconProps) {
    const icon = icons.getNodeIcon([...typeHierarchy].reverse());

    return <span style={{ fontSize: 20, fontFamily: 'cloudify' }}>{icon}</span>;
}
