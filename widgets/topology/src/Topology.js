/**
 * Created by kinneretzin on 06/11/2016.
 */

import AngularAppManager from './AngularAppManager';
import './TopologyAngularApp.js';

let angularAppManager = new AngularAppManager();

export default class Topology extends React.Component {
    constructor(props, context) {
        super(props, context);

        // We use this property to clear the angular directive (inorder to destroy the application)
        this.state = {
            initialized : props.data !== null && props.data !== undefined
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data)
            || !_.isEqual(this.props.template, nextProps.template);
    }

    componentDidMount() {

        angularAppManager.start(this.refs.topologyContainer,'topologyApp');
        this._setStyle();

        // Set the first time data
        angularAppManager.fireEvent('updateData',this.props.data);
    }

    _setStyle() {
        // Set the container's size (its only available after loading the template)
        $(this.refs.topologyContainer).find('.topologyContainer').css({
            "position": "absolute",
            "left": "10px",
            "top": "10px",
            "bottom": "10px",
            "right": "10px"
        });

        var loadingHtml = Stage.ComponentToHtmlString(<Stage.Basic.Loading/>);
        // Change the loading indication to be our loading indication (only available after bootstraping angular component - defined in the directive)
        $(this.refs.topologyContainer).find('.loading').html(loadingHtml);

    }

    // If we are getting new props and configuration have changed, we need to first clear the content of the component so it will
    // fully destory the angular application. This is why we set the 'initialized' state to false. It will make the render not draw
    // the directive , in 'componentDidUpdate' we will set it back to initialized causeing the 'render' to be called again, and
    // re-initialize the angular application
    componentWillReceiveProps (nextProps) {
        if (this.props.data.topologyConfig &&
            (this.props.data.topologyConfig.enableNodeClick !== nextProps.data.topologyConfig.enableNodeClick ||
            this.props.data.topologyConfig.enableGroupClick !== nextProps.data.topologyConfig.enableGroupClick ||
            this.props.data.topologyConfig.enableZoom !== nextProps.data.topologyConfig.enableZoom ||
            this.props.data.topologyConfig.enableDrag !== nextProps.data.topologyConfig.enableDrag ||
            this.props.data.topologyConfig.showToolbar !== nextProps.data.topologyConfig.showToolbar)) {

            angularAppManager.destroy();
            this.setState({initialized: false});
        }

    }

    componentDidUpdate(prevProps, prevState) {
        // If the application was now intialized (was false before) we need to bootstrap the angular app
        if (this.state.initialized && !prevState.initialized) {
            angularAppManager.start(this.refs.topologyContainer,'topologyApp');
            this._setStyle();

            angularAppManager.fireEvent('updateData',this.props.data);

            // If a deployment Id or blueprint Id has changed, need to re-fetch the topology data
        } else if (this.props.data.blueprintId !== prevProps.data.blueprintId ||
            this.props.data.deploymentId !== prevProps.data.deploymentId) {

            angularAppManager.fireEvent('setLoading');
            this.props.toolbox.refresh();

            // Check if configuration has changed, if so , set the initialized to true, to cause it to render again, but now it
            // will re-create the angular directive.
        } else if (this.props.data.topologyConfig &&
            (this.props.data.topologyConfig.enableNodeClick !== prevProps.data.topologyConfig.enableNodeClick ||
            this.props.data.topologyConfig.enableGroupClick !== prevProps.data.topologyConfig.enableGroupClick ||
            this.props.data.topologyConfig.enableZoom !== prevProps.data.topologyConfig.enableZoom ||
            this.props.data.topologyConfig.enableDrag !== prevProps.data.topologyConfig.enableDrag ||
            this.props.data.topologyConfig.showToolbar !== prevProps.data.topologyConfig.showToolbar)) {

            this.setState({initialized: true});
        } else {
            {
                // TODO maybe need to check if the data was actually changed, because soemthing else in the context might have changed...
                // Else it means that a new topology data was fetched, need to redraw
                angularAppManager.fireEvent('updateData',this.props.data);
            }
        }
    }
    render () {
        // Not render the directive incase initialized is false
        if (!this.state.initialized) {
            return <Stage.Basic.Loading/>;
        }

        return (
            <div ref='topologyParentContainer'>
                <div ref='topologyContainer' dangerouslySetInnerHTML={{__html: this.props.template }}></div>
            </div>
        );

    }
}

