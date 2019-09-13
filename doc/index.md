## Widgets Components API Reference
Welcome to [Cloudify](http://cloudify.co)’s Widgets Components API Reference documentation!

You can find here documentation for all [ReactJS](https://reactjs.org/) components developed by Cloudify team. All of those can be used in custom widgets development.

### Semantic UI React

All Cloudify built-in widgets were created using components from [Semantic-UI-React](http://react.semantic-ui.com/) UI development framework. 

The following components from Semantic-UI-React can be accessed using `Stage.Basic` global object: 
[Accordion](https://react.semantic-ui.com/modules/accordion), 
[Breadcrumb](https://react.semantic-ui.com/collections/breadcrumb), 
[Button](https://react.semantic-ui.com/elements/button), 
[Card](https://react.semantic-ui.com/views/card), 
[Checkbox](https://react.semantic-ui.com/modules/checkbox), 
[Container](https://react.semantic-ui.com/elements/container), 
[Divider](https://react.semantic-ui.com/elements/divider), 
[Grid](https://react.semantic-ui.com/collections/grid), 
[Header](https://react.semantic-ui.com/elements/header), 
[Icon](https://react.semantic-ui.com/elements/icon), 
[Image](https://react.semantic-ui.com/elements/image), 
[Input](https://react.semantic-ui.com/elements/input), 
[Item](https://react.semantic-ui.com/views/item), 
[Label](https://react.semantic-ui.com/elements/label), 
[List](https://react.semantic-ui.com/elements/list), 
[Loader](https://react.semantic-ui.com/elements/loader), 
[Message](https://react.semantic-ui.com/collections/message), 
[Modal](https://react.semantic-ui.com/modules/modal), 
[Portal](https://react.semantic-ui.com/addons/portal), 
[Progress](https://react.semantic-ui.com/modules/progress), 
[Radio](https://react.semantic-ui.com/addons/radio), 
[Segment](https://react.semantic-ui.com/elements/segment), 
[Sidebar](https://react.semantic-ui.com/modules/sidebar), 
[Step](https://react.semantic-ui.com/elements/step), 
[Table](https://react.semantic-ui.com/collections/table). 

For example if you want to use Map component use `Stage.Basic.Map`. 

### React Leaflet

Some built-in widgets were created using components from [React-Leaflet](https://react-leaflet.js.org) library. 

The following components from React-Leaflet can be accessed using `Stage.Basic.Leaflet` global object: 
[Map](https://react-leaflet.js.org/docs/en/components#map), 
[TileLayer](https://react-leaflet.js.org/docs/en/components#tilelayer), 
[Marker](https://react-leaflet.js.org/docs/en/components#marker), 
[Popup](https://react-leaflet.js.org/docs/en/components#popup). 

For example if you want to use Message component use `Stage.Basic.Message`. 

### Useful links
- [Cloudify Console @ GitHub](https://github.com/cloudify-cosmo/cloudify-stage) - official Git repository with Cloudify Console source code
- [Cloudify Console Widgets Boilerplate @ GitHub](https://github.com/cloudify-cosmo/Cloudify-UI-Widget-boilerplate) - Git repository containing widget development environment  
- [Cloudify Documentation](http://docs.cloudify.co) - latest official version of Cloudify documentation
- [Writing Widgets @ Cloudify Documentation](http://docs.cloudify.co/latest/developer/writing_widgets/) - latest version of creating custom widgets how-to