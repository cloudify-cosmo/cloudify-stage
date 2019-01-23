/**
 * Created by barucoh on 23/1/2019.
 */
import ELK from 'elkjs/lib/elk.bundled.js';
const elk = new ELK();

const tasksGraphsFetchUrl = '/tasks_graphs'
const operationsFetchUrl = '/operations'

const graph = {
    id: "root",
    layoutOptions: { 
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': '20f',
        'layered.spacing.nodeNodeBetweenLayers': '70f'
    },
    children: [
      { id: "n1", width: 160, height: 60, labels: [{text: 'I am Root!'}] },
      { id: "n2", width: 160, height: 60 },
      { id: "n3", width: 160, height: 60 },
      { id: "n4", width: 160, height: 60 },
      { id: "n5", width: 160, height: 60 },
      { id: "n6", width: 160, height: 60 },
      { id: "n7", width: 160, height: 60 }
    ],
    edges: [
      { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
      { id: "e2", sources: [ "n1" ], targets: [ "n3" ] },
      { id: "e3", sources: [ "n1" ], targets: [ "n4" ] },
      { id: "e4", sources: [ "n2" ], targets: [ "n5" ] },
      { id: "e5", sources: [ "n2" ], targets: [ "n3" ] },
      { id: "e6", sources: [ "n1" ], targets: [ "n5" ] },
      { id: "e7", sources: [ "n6" ], targets: [ "n7" ] },
      { id: "e8", sources: [ "n1" ], targets: [ "n7" ] }
    ]
  }

export default class ExecutionWorkflowGraph extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphResult: undefined
        };
        this.toolbox = Stage.Utils.getToolbox(()=>{}, ()=>{}, null);
        console.log(props);
    }
    componentDidUpdate() {
        console.log('updated');
    }
    componentDidMount() {
        let tasksGraphParams = {execution_id: this.props.selectedExecution.id}
        this.toolbox.getManager().doGet(tasksGraphsFetchUrl, tasksGraphParams)
            .then((data) => {
                console.log(data);
            })
        elk.layout(graph)
            .then((g) => {
                if (this.state.graphResult !== g)
                {
                    this.setState({
                        graphResult: g
                    })
                }
            })
            .catch(console.error)
    }
    render() {
        if (this.state.graphResult !== undefined) {
            return (
                <div id='graphContainer'>
                    <svg height={350} width={1200}>
                        {
                            this.state.graphResult.children.map((child) => (
                                <g key={`${child.id}`} stroke='black'>
                                    <rect
                                        height={child.height}
                                        width={child.width}
                                        x={child.x}
                                        y={child.y}
                                        fill='white'
                                        strokeWidth='2'
                                    />
                                    <text
                                        x={child.x + 5}
                                        y={child.y - 2}
                                    >
                                    Node
                                    </text>
                                    <text
                                        x={child.x + 10}
                                        y={(child.height / 2) + child.y}
                                    >
                                    Operation {child.id}
                                    </text>
                                </g>
                            ))
                        }
                        {
                            this.state.graphResult.edges.map((edge) => {
                                let startPoint = edge.sections[0].startPoint;
                                let bendPoints = edge.sections[0].bendPoints;
                                let endPoint = edge.sections[0].endPoint;
                                let drawingPath = {
                                    x: 0,
                                    y: 0
                                }
                                if (!bendPoints) {
                                    // No Bend Points
                                    // Start point to end point
                                    drawingPath.x = endPoint.x - startPoint.x
                                    drawingPath.y = endPoint.y - startPoint.y
                                    return (
                                        <g key={edge.id} fill='none' stroke='black' strokeWidth='2'>                                            
                                            <path
                                                key={`${startPoint.x + startPoint.y}`}
                                                d={`m${startPoint.x} ${startPoint.y} l${drawingPath.x} ${drawingPath.y}`}
                                            />
                                            <path
                                                key={`${endPoint.x-0.9 + endPoint.y+5}`}
                                                d={`m${endPoint.x-0.9} ${endPoint.y} l-5 5`}
                                            />
                                            <path
                                                key={`${endPoint.x-0.9 + endPoint.y-5}`}
                                                d={`m${endPoint.x-0.9} ${endPoint.y} l-5 -5`}
                                            />
                                        </g>
                                    )
                                } else {
                                    // At least 1 Bend Point exists
                                    // Start point to first bend point - Bend point to bend point - Bend point to end point
                                    let lastBendPoint = {...bendPoints[bendPoints.length - 1]}
                                    let lastDrawingPath = {...drawingPath}
                                    drawingPath.x = bendPoints[0].x - startPoint.x
                                    drawingPath.y = bendPoints[0].y - startPoint.y
                                    lastDrawingPath.x = endPoint.x - lastBendPoint.x
                                    lastDrawingPath.y = endPoint.y - lastBendPoint.y
                                    return (
                                        <g key={edge.id} fill='none' stroke='black' strokeWidth='2'>
                                            <path
                                                key={`${startPoint.x + startPoint.y}`}
                                                d={`m${startPoint.x} ${startPoint.y} l${drawingPath.x} ${drawingPath.y}`}
                                            />
                                            {
                                                bendPoints.map((bendPoint, index) => {
                                                    // Already covered first index - Will draw nothing in the first iteration
                                                    if(index !== 0)
                                                    {
                                                        let prevBendPoint = {...bendPoints[index - 1]}
                                                        drawingPath.x = bendPoint.x - prevBendPoint.x
                                                        drawingPath.y = bendPoint.y - prevBendPoint.y
                                                        return (
                                                            <path
                                                                key={`${bendPoint.x + bendPoint.y}`}
                                                                d={`m${prevBendPoint.x} ${prevBendPoint.y} l${drawingPath.x} ${drawingPath.y}`}
                                                            />
                                                        )
                                                    }
                                                })
                                            }
                                            <path
                                                key={`${endPoint.x + endPoint.y}`}
                                                d={`m${lastBendPoint.x} ${lastBendPoint.y} l${lastDrawingPath.x} ${lastDrawingPath.y}`}
                                            />
                                            <path
                                                key={`${endPoint.x-0.9 + endPoint.y+5}`}
                                                d={`m${endPoint.x-0.9} ${endPoint.y} l-5 5`}
                                            />
                                            <path
                                                key={`${endPoint.x-0.9 + endPoint.y-5}`}
                                                d={`m${endPoint.x-0.9} ${endPoint.y} l-5 -5`}
                                            />
                                        </g>
                                    )
                                }
                            })
                        }
                    </svg>
                </div>
            )
        }
        else {
            return (
                <div id='graphContainer'>
                    <label>Loading...</label>
                </div>
            )
        }
    }
}