(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by kinneretzin on 02/10/2016.
 */

var MyComponent = function (_React$Component) {
    _inherits(MyComponent, _React$Component);

    function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, (MyComponent.__proto__ || Object.getPrototypeOf(MyComponent)).apply(this, arguments));
    }

    _createClass(MyComponent, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                "Return shit"
            );
        }
    }]);

    return MyComponent;
}(React.Component);

exports.default = MyComponent;

},{}],2:[function(require,module,exports){
'use strict';

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

addPlugin({
    id: "reactTest",
    name: 'A React test',
    description: 'see if we can use react here',
    initialWidth: 4,
    initialHeight: 2,
    color: "violet",
    initialConfiguration: { filterBy: "" },
    showHeader: true,
    isReact: true,
    //init: function(pluginUtils) {
    //
    //},
    render: function render(widget, data, error, context, pluginUtils) {
        return React.createElement(_component2.default, null);

        //return pluginUtils.buildFromTemplate(widget.plugin.template);
    },
    postRender: function postRender(el, plugin, data, context, pluginUtils) {}
}); /**
     * Created by kinneretzin on 02/10/2016.
     */

},{"./component":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3JlYWN0VGVzdC9zcmMvY29tcG9uZW50LmpzIiwicGx1Z2lucy9yZWFjdFRlc3Qvc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7SUFJTSxXOzs7Ozs7Ozs7OztpQ0FDTztBQUNMLG1CQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFESjtBQUdIOzs7O0VBTHFCLE1BQU0sUzs7a0JBUWpCLFc7Ozs7O0FDUmY7Ozs7OztBQUVBLFVBQVU7QUFDTixRQUFJLFdBREU7QUFFTixVQUFNLGNBRkE7QUFHTixpQkFBYSw4QkFIUDtBQUlOLGtCQUFjLENBSlI7QUFLTixtQkFBZSxDQUxUO0FBTU4sV0FBTyxRQU5EO0FBT04sMEJBQXNCLEVBQUMsVUFBVSxFQUFYLEVBUGhCO0FBUU4sZ0JBQVksSUFSTjtBQVNOLGFBQVUsSUFUSjtBQVVOO0FBQ0E7QUFDQTtBQUNBLFlBQVEsZ0JBQVMsTUFBVCxFQUFnQixJQUFoQixFQUFxQixLQUFyQixFQUEyQixPQUEzQixFQUFtQyxXQUFuQyxFQUFnRDtBQUNwRCxlQUFPLDhDQUFQOztBQUVBO0FBQ0gsS0FqQks7QUFrQk4sZ0JBQVksb0JBQVMsRUFBVCxFQUFZLE1BQVosRUFBbUIsSUFBbkIsRUFBd0IsT0FBeEIsRUFBZ0MsV0FBaEMsRUFBNkMsQ0FDeEQ7QUFuQkssQ0FBVixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDAyLzEwLzIwMTYuXG4gKi9cblxuY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+UmV0dXJuIHNoaXQ8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE15Q29tcG9uZW50O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDAyLzEwLzIwMTYuXG4gKi9cblxuaW1wb3J0IE15Q29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50JztcblxuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJyZWFjdFRlc3RcIixcbiAgICBuYW1lOiAnQSBSZWFjdCB0ZXN0JyxcbiAgICBkZXNjcmlwdGlvbjogJ3NlZSBpZiB3ZSBjYW4gdXNlIHJlYWN0IGhlcmUnLFxuICAgIGluaXRpYWxXaWR0aDogNCxcbiAgICBpbml0aWFsSGVpZ2h0OiAyLFxuICAgIGNvbG9yOiBcInZpb2xldFwiLFxuICAgIGluaXRpYWxDb25maWd1cmF0aW9uOiB7ZmlsdGVyQnk6IFwiXCJ9LFxuICAgIHNob3dIZWFkZXI6IHRydWUsXG4gICAgaXNSZWFjdCA6IHRydWUsXG4gICAgLy9pbml0OiBmdW5jdGlvbihwbHVnaW5VdGlscykge1xuICAgIC8vXG4gICAgLy99LFxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICByZXR1cm4gPE15Q29tcG9uZW50Lz47XG5cbiAgICAgICAgLy9yZXR1cm4gcGx1Z2luVXRpbHMuYnVpbGRGcm9tVGVtcGxhdGUod2lkZ2V0LnBsdWdpbi50ZW1wbGF0ZSk7XG4gICAgfSxcbiAgICBwb3N0UmVuZGVyOiBmdW5jdGlvbihlbCxwbHVnaW4sZGF0YSxjb250ZXh0LHBsdWdpblV0aWxzKSB7XG4gICAgfVxufSk7XG4iXX0=
