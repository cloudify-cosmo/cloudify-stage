/**
 * Created by pawelposel on 03/11/2016.
 */

import { Link } from 'react-router-dom';

Stage.defineWidget({
    id: "deploymentNum",
    name: "Number of deployments",
    description: 'Number of deployments',
    initialWidth: 2,
    initialHeight: 8,
    color : "green",
    showHeader: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentNum'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {id: 'page', name: 'Page to open on click', description: 'Page to open when user clicks on widget content',
         type: Stage.Basic.GenericField.CUSTOM_TYPE, component: Stage.Basic.PageFilter}
    ],
    fetchUrl: '[manager]/deployments?_include=id&_size=1',

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        const num = _.get(data, 'metadata.pagination.total', 0);
        const to = widget.configuration.page ? `/page/${widget.configuration.page}` : '/';
        const KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <Link to={to}>
                <KeyIndicator title="Deployments" icon="cube" number={num}/>
            </Link>
        );
    }
});
