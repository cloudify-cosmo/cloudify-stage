/**
 * Created by kinneretzin on 14/02/2017.
 */

Stage.defineWidget({
    id: 'GaugeTest',
    name: "gauge test",
    description: '',
    initialWidth: 4,
    initialHeight: 15,
    color: "yellow",
    showHeader: false,
    showBorder: false,
    isReact: true,

    render: function(widget,data,error,toolbox) {
        return (
            <Stage.Basic.Graphs.Gauge value={12} min={0} max={20} high={15} low={3} minAngle={-90} maxAngle={90}/>

        );

    }
});