#How to write a plugin

Cloudify UI provides an easy way to add plugins to the system.

##Plugin file structure

Each plugin must contain 3 files:

* widget.js - Holds the plugin's definition
* widget.png - A preview image of the plugin
* widget.html - A widget template file. The template file is optional.

A plugin should be placed in the plugins library, in a library carring the id of the plugin.

For example, if we are creating a blueprint plugin (id=blueprint) then the blueprint library should be:

```
   /plugins
      /blueprint
         widget.js
         widget.html
         widget.png
```

## Widget definition

Each widget.js file should have one call to a global function called 'addPlugin'.


###addPlugin gets a settings object with the following options:

option | type | default | description
--- | --- | --- | ---
id |  String | - |  *Required* The id of the plugin. Should match the directory that we placed this plugin in 
name | String | - |  *Required* The display name of this plugin. This name will show in the 'add Widget' dialog, and will also be the default widget name once added to the page.
description | String | - | An optional description of the plugin. It will be shown in the 'add Widget' dialog below the widget name.
initialWidth | Integer| - | *Required* The default (initial) width of the widget when added to a page
initialHeight | Integer| - | *Required* The default (initial) height of the widget when added to a page
color | String | red | one out of : red , orange , yellow, olive, green, teal,blue, violet,purple,pink,brown,grey,black
showHeader | Boolean| true | If we should show a widget header or not. If an header is not shown the user cannot change the widget name (which is only visible in the header) 
fetchUrl | String| - | If fetchUrl exists, the data from this url will be fetched by the application and passed to the render and postRender methods. *Important* the render will be called once before the data is fetched (to allow showing loading or partial data) and once the data is fetched. 
events | Array | | | A list of event objects describing the attached events to this widget (once rendered). See events option description below. 


###Event object is defined like so:

option | type | description
--- | --- | --- 
selector | string | *Required* A JQuery selector for the element we want to attach the event to. 
event | string | *Required* The event name we want to attach it to (jQuery events), for example 'click'
fn | function | An event handler function. See event handler function description below

###Event handler function gets these parameters:

parameter | description
--- | ---
e | The event object
widget | The widget object (will be described in the 'widget object' section
context | The plugin context (will be described in the 'plugin context' section
pluginUtils | Plugin Utilities (will be described in the 'plugin utilities' section

for example
```javascript
events: [
    {
        selector: '.row',
        event: 'click',
        fn: (e,widget,context,pluginUtils)=> {
            var blueprintId = pluginUtils.jQuery(e.currentTarget).data('id');
            var oldSelectedBlueprintId = context.getValue('blueprintId');
            context.setValue('blueprintId',blueprintId === oldSelectedBlueprintId ? null : blueprintId);
        }
    }
```

###Available plugin functions

*init*(pluginUtils)
Init is called when the plugin is loaded, which happens once when the system is loaded. This can be used to define some global stuff, such as classes and objects we are going to use in our plugin definition.

*render*(widget,data,context,pluginUtils)
Render is called everytime the widget needs to draw itself. 
It can be when the page is loaded, when widget data was changed, when context data was changed , when plugin data was fetched, and etc. 


render parameters are:
 
* The widget object itself (see description in 'widget object' section)
* The fetched data (either using fetchUrl or fetchData method). The data will be null if fetchData or fetchUrl was not defined, and also untill the data is fetched it will pass null to the render method (if you expect data you can render 'loading' indication in such a case)
* The context object (see description in the 'Plugin context' section)
* pluginUtils (see 'Plugin utilities' section) 
 
 
*postRender*(el,plugin,data,context,pluginUtils)
*fetchData*(plugin,context,pluginUtils)

###Widget object

Event object has the following attributes

attribute | description
--- | ---
id | The id of the widget (uuid)
name | The display name of the widget (The plugin name is the default name for the widget, but the user can chagne it)
height | The actual height of the widget on the page
width | The actual width of the widget on the page 
x | The actual x location of the widget on the page
y | The actual y location of the widget on the page
plugin | The plugin object as it was passed to addPlugin method. The only additional field there that the widget can access is the 'template'. The template is fetched from the html and added on the plugin definition.

###Plugin context
Plugin context gives access to the application context. Using the context we can pass arguments between widgets, for example when a blueprint is selected, set the context to the selected blueprint, and all the widgets that can filter by blueprint can read this value and filter accordingly.
Using the context is done by using 'setValue' and 'getValue' of the pluginContext:
 
 * setValue(key,value)
 * getValue(key) - returns value

It gives access to the selected manager's url:
 * getManagerUrl()

If we did some actions in the widget that will require fetching the data again (for example we added a record) we can ask the app to refresh only this plugin by calling:
 * refresh()

Plugin context also support drilling down to a page.
Drilling down to a page requires passing the drilldown page template name. Templates will be described in the next section. When a widget is on a page, and drilldown action done (through link click event to a button for example), if its the first time we access this drilldown page, the app will create a new page based on the passed template. Once this page is created the user can edit it like any other page. All next accesses to this page will use this page.
The drillDown method is defined like so:

drillDown(widget,defaultTemplate)

for example:
When selecting a deployment we drilldown to a deployment page. It looks like this:

```javascript
    events: [
        {
            selector: '.row',
            event: 'click',
            fn: (e,widget,context,pluginUtils)=> {
                // Setting the selected deployment id on the context 
                var deploymentId = pluginUtils.jQuery(e.currentTarget).data('id');
                context.setValue('deploymentId',deploymentId);

                // Calling drilldown with this widget (self) and a template called deployment
                context.drillDown(widget,'deployment');
            }
        }

    ],
```

The 'deployment' template looks like this:
```json
{
  "name": "Deployment",
  "widgets": [
    {
      "name": "topology",
      "plugin": "topology",
      "width": 12,
      "height": 5,
      "x": 0,
      "y": 0
    },
    {
      "name": "CPU Utilization - System",
      "width": 6,
      "height": 4,
      "plugin": "cpuUtilizationSystem",
      "x": 0,
      "y": 5
    },
    {
      "name": "CPU Utilization - User",
      "width": 6,
      "height": 4,
      "plugin": "cpuUtilizationUser",
      "x": 6,
      "y": 5
    },
    {
      "name": "Deployment Inputs",
      "width": 5,
      "height": 3,
      "plugin": "inputs",
      "x": 0,
      "y": 9
    },
    {
      "name": "Deployment Events",
      "width": 7,
      "height": 3,
      "plugin": "events",
      "x": 5,
      "y": 9
    }
  ]
}
```

###Drilldown page templates
Drill down page templates are defined in the '/templates' library.

The library looks liks this:
```
   /templates
      template1.json
      template2.json
      ...
      templates.json     
```

The templates.json contains a list of the available templates (temporary until we'll have a server that will handle this).
Each template file contains one page template configuration.

template configuration has a name which is the default page name, and list of widgets. 
Each widget will have the following fields

field | description
--- | ---
name | Widget default name
plugin | The id of the plugin to use
width | The initial width of the widget on the page
height | The initial height of the widget on the page
x | The initial x location of the widget on the page
y | The initial y location of the widget on the page

If x and/or y are not defined the page will be auto arranged (not recommended)

For example:
```json
{
  "name": "template-name",
  "widgets": [
    {
      "name": "topology",
      "plugin": "topology",
      "width": 12,
      "height": 5,
      "x": 0,
      "y": 0
    },
    ....
  ]
}
```

###Plugin utilities

Plugin utilities gives access to some 3rd party utilities that Cloudify UI supports:

*buildFromTemplate*(html,data) 
gets the html template and the data for the template and returns a compiled html

for example:
```javascript
   return pluginUtils.buildFromTemplate("<div>something</div>",{});
```

*renderLoading*()
returns an html string that generates a standard loading. Can be used to generate loading indication incase the data was not fetched yet.
For example:

```javascript
    render: function(widget,data,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderLoading();
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template,data);
    },
```

*moment* a date/time parsing utility. [Moment documentation](http://momentjs.com/docs/)

for example:
```javascript

        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), 
                    updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                })
            })
        });
        return pluginUtils.buildFromTemplate(widget.plugin.template,formattedData);
```

*jQuery*

for example:
```
    postRender: function(el,widget,data,context,pluginUtils) {
        pluginUtils.jQuery(el).find('.ui.dropdown').dropdown({
            onChange: (value, text, $choice) => {
                context.setValue('selectedValue',value);
            }
        });
    })
```


## Widget template

The widget template is an html file written with [lodash template engine](https://lodash.com/docs/4.15.0#template).
 
Widget template if fetched when the plugin is loaded, and its passed to the render function. To access it use widget.plugin.template.
To render the template using the built in lodash templates engine use `pluginUtils.buildFromTemplate(widget.plugin.template,data)`, where 'data' is any context you want to pass on to the template.
For example, a simple render function will look like this

```javascript
    render: function(widget,data,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'missing template';
        }
        return pluginUtils.buildFromTemplate(widget.plugin.template,{});

    }
```

## Future features

* Context having levels - widget, page, application
* Provide dev env for plugin
* Ability to upload a plugin through the system, and not having to put it in the '/plugin' library
* Plugin holding more then one widget
