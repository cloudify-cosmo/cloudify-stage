/**
 * Created by Alex on 29/06/2017.
 */
const { Button } = Stage.Basic;

Stage.defineWidget({
    id: "composerLink",
    name: "Composer link",
    description: 'Opens Cloudify Composer in a different tab',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    isReact: true,

    render: function(widget,data,error,toolbox) {
        const composerUrl = `${location.protocol}//${location.hostname}:8443/composer`;

        return (
            <Button className="labeled icon" color="blue" fluid icon="external"
                    onClick={()=>{window.open(composerUrl, '_blank')}}
                    content="Cloudify Composer"/>
        );

    }

});
