/**
 * Created by pawelposel on 03/11/2016.
 */

Stage.addPlugin({
    id: "graph",
    name: "Test graph",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color : "blue",
    isReact: true,

    fetchData: function(plugin,context,pluginUtils) {
        var lineData = [{
            name: "series1",
            values: [{ x: 0, y: 20 }, { x: 1, y: 30 }, { x: 2, y: 10 }, { x: 3, y: 5 }, { x: 4, y: 8 }, { x: 5, y: 15 }, { x: 6, y: 10 }],
            strokeWidth: 3,
            strokeDashArray: "5,5"
        }, {
            name: "series2",
            values: [{ x: 0, y: 8 }, { x: 1, y: 5 }, { x: 2, y: 20 }, { x: 3, y: 12 }, { x: 4, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 2 }]
        }, {
            name: "series3",
            values: [{ x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 2 }, { x: 4, y: 6 }, { x: 5, y: 4 }, { x: 6, y: 2 }]
        }];

        var barData = [{
            "name": "Series A",
            "values": [{ "x": 1, "y": 91 }, { "x": 2, "y": 290 }, { "x": 3, "y": 146 }]
        }, {
            "name": "Series B",
            "values": [{ "x": 1, "y": 9 }, { "x": 2, "y": 49 }, { "x": 3, "y": 144 }]
        }, {
            "name": "Series C",
            "values": [{ "x": 1, "y": 14 }, { "x": 2, "y": 77 }, { "x": 3, "y": 16 }]
        }];

        return Promise.resolve({lineData: lineData, barData: barData});
    },

    render: function(widget,data,error,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        let LineChart = Stage.Basic.LineChart;
        let BarChart = Stage.Basic.BarChart;

        return (
            <div>
                <LineChart legend={true}
                           data={data.lineData}
                           width="100%"
                           height={300}
                           viewBoxObject={{x: 0, y: 0, width: 700, height: 300 }}
                           yAxisLabel="Altitude"
                           xAxisLabel="Elapsed Time (sec)"
                           gridHorizontal={true}
                />

                <BarChart
                    data={data.barData}
                    width="100%"
                    height={300}
                    viewBoxObject={{x: 0, y: 0, width: 700, height: 300 }}
                    fill={'#3182bd'}
                    yAxisLabel='Label'
                    xAxisLabel='Value'
                />
            </div>
        );
    }
});