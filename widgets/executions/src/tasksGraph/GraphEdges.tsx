import type { ElkExtendedEdge } from 'elkjs/lib/elk-api';
import GraphEdge from './GraphEdge';

const GraphEdges = ({ graphEdges = [] }: { graphEdges: ElkExtendedEdge[] }) => (
    <>
        {graphEdges.map(graphEdge => (
            <GraphEdge key={graphEdge.id} graphEdge={graphEdge} />
        ))}
    </>
);

export default GraphEdges;
