/**
 * Created by pposel on 28/02/2017.
 */
import Actions from './actions';

export default class BlueprintSources extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            content: "",
            type: "json"
        }
    }

    _selectFile(selectedKeys, info) {
        if (_.isEmpty(selectedKeys) || !_.isEmpty(info.node.props.children)) {
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

            this.setState({content:data, type, error: ""});
            this.refs.contentOverlay.show();
        }).catch(err => {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    render() {
        var {NodesTree, Message, Label, Overlay, HighlightText, ErrorMessage, Icon} = Stage.Basic;

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
                    <div>
                        <NodesTree showLine selectable defaultExpandAll onSelect={this._selectFile.bind(this)}>
                            <NodesTree.Node title={<Label color='purple' horizontal>{this.props.data.blueprintId}</Label>} key="0">
                                {loop(this.props.data.tree.children)}
                            </NodesTree.Node>
                        </NodesTree>

                        <Overlay ref="contentOverlay">
                            <HighlightText className={this.state.type}>{this.state.content}</HighlightText>
                        </Overlay>
                    </div>
                    :
                    <div>
                        <Message content="Please select blueprint to display source files" info/>
                    </div>
                }
            </div>
        );
    }
};
