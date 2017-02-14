/**
 * Created by pawelposel on 13/02/2017.
 */

Stage.defineWidget({
    id: "buttonLink",
    name: "Button link",
    description: 'Opens provided URL in a different tab',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    initialConfiguration: [
        {id: "label",name: "Button label", default: "Button Link", type: Stage.Basic.GenericField.STRING},
        {id: "url",name: "URL address", default: "", type: Stage.Basic.GenericField.STRING}
    ],
    isReact: true,

    render: function(widget,data,error,toolbox) {
        var Button = Stage.Basic.Button;

        return (
            <Button className="labeled icon" color="green" fluid icon="external" disabled={!widget.configuration.url}
                    onClick={()=>{window.open(widget.configuration.url, '_blank')}}
                    content={widget.configuration.label}/>
        );

    }

});