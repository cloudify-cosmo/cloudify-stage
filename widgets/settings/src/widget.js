/**
 * Created by Alex on 1/23/2017.
 */

import Wrapper from './Wrapper';

Stage.defineWidget({
    id: "settings",
    name: "Settings",
    description: 'Shows settings',
    initialWidth: 12,
    initialHeight: 5,
    color: "green",
    isReact: true,

    render: function(/*widget, data, error, toolbox*/) {
        return (
            <Wrapper></Wrapper>
        )
    }
});
