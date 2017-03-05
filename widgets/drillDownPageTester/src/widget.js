/**
 * Created by kinneretzin on 07/09/2016.
 */


Stage.defineWidget({
    id: "drillDownPageTester",
    name: "drilldown tester",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color : "blue",
    isReact: true,
    render: function(widget,data,error,toolbox) {

        return (
            <div>
                <button onClick={()=>{toolbox.drillDown(widget,'app',null,'abc')}} > DrillDownA </button>
                <button onClick={()=>{toolbox.drillDown(widget,'blueprints',null,'abc')}} > DrillDownB </button>
            </div>
        );

    }
});