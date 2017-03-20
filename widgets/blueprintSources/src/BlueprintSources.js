/**
 * Created by pposel on 28/02/2017.
 */
import Actions from './actions';

export default class BlueprintSources extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = BlueprintSources.initialState;
    }

    static initialState = {
        content: "",
        filename: "",
        error: "",
        type: "json"
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data ) {
            this.setState(BlueprintSources.initialState);
        }
    }

    _selectFile(selectedKeys, info) {
        if (_.isEmpty(selectedKeys) || !_.isEmpty(info.node.props.children)) {
            this.setState({content:"", filename:""});
            return;
        }

        var path = selectedKeys[0];

        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doGetFileContent(path).then(data => {
            var type = "basic";
            if (_.endsWith(path, ".yaml") || _.endsWith(path, ".yml")) {
                type = "yaml";
            } else if (_.endsWith(path, ".py")) {
                type = "python";
            } else if (_.endsWith(path, ".sh")) {
                type = "bash";
            } else if (_.endsWith(path, ".json")) {
                type = "json";
            }

            this.props.toolbox.loading(false);

            this.setState({content:data, filename:info.node.props.title.props.children[1], type, error: ""});
        }).catch(err => {
            this.setState({error: err.message, content:"", filename:""});
            this.props.toolbox.loading(false);
        });
    }

    render() {
        var {NodesTree, Message, Label, Overlay, HighlightText, ErrorMessage, Icon, SplitterLayout} = Stage.Basic;

        const loop = data => {
            return data.map(item => {
                if (item.children) {
                    return (
                        <NodesTree.Node key={item.key}
                                        title={<span><Icon className="treeIcon" name="folder open outline"/>{item.title}</span>}>
                            {loop(item.children)}
                        </NodesTree.Node>
                    );
                }
                return <NodesTree.Node key={item.key}
                                       title={<span><Icon className="treeIcon" name="file outline"/>{item.title}</span>}/>;
            });
        };

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                {this.props.data.blueprintId ?
                    <SplitterLayout primaryIndex={0} percentage secondaryInitialSize={this.props.widget.configuration.contentPaneWidth}>
                        <div>
                            <NodesTree showLine selectable defaultExpandAll onSelect={this._selectFile.bind(this)}>
                                <NodesTree.Node title={<Label color='purple' horizontal>{this.props.data.blueprintId}</Label>} key="0">
                                    {loop(this.props.data.tree.children)}
                                </NodesTree.Node>
                            </NodesTree>
                        </div>
                        {this.state.content ?
                            <div className="alignHighlight">
                                <HighlightText className={this.state.type}>{this.state.content}</HighlightText>
                                <Label attached='top right' size="small" onClick={()=> this.refs.contentOverlay.show()}>
                                    <Icon name="maximize" link/>{this.state.filename}
                                </Label>
                                <Overlay ref="contentOverlay">
                                    <HighlightText className={this.state.type}>{this.state.content}</HighlightText>
                                </Overlay>
                            </div>
                            :
                            <div className="verticalCenter centeredIcon">
                                <Icon name="file outline" size="big" color="grey"/>
                            </div>
                        }
                    </SplitterLayout>
                    :
                    <div>
                        <Message content="Please select blueprint to display source files" info/>
                    </div>
                }
            </div>
        );
    }
};
