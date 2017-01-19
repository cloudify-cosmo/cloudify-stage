(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.defineWidget({
    id: "serversNum",
    name: "Number of servers",
    description: 'Number of servers',
    initialWidth: 2,
    initialHeight: 2,
    color: "green",
    showHeader: false,
    isReact: true,
    initialConfiguration: [{ id: "pollingTime", default: 5 }],
    fetchUrl: '[manager]/node-instances?_include=id',

    render: function render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return React.createElement(Stage.Basic.Loading, null);
        }

        var num = _.get(data, "metadata.pagination.total", 0);
        var KeyIndicator = Stage.Basic.KeyIndicator;

        return React.createElement(KeyIndicator, { title: "Servers", icon: "server", number: num });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzXFxzZXJ2ZXJzTnVtXFxzcmNcXHdpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFJQSxNQUFNLFlBQU4sQ0FBbUI7QUFDZixRQUFJLFlBRFc7QUFFZixVQUFNLG1CQUZTO0FBR2YsaUJBQWEsbUJBSEU7QUFJZixrQkFBYyxDQUpDO0FBS2YsbUJBQWUsQ0FMQTtBQU1mLFdBQVEsT0FOTztBQU9mLGdCQUFZLEtBUEc7QUFRZixhQUFTLElBUk07QUFTZiwwQkFBc0IsQ0FDbEIsRUFBQyxJQUFJLGFBQUwsRUFBb0IsU0FBUyxDQUE3QixFQURrQixDQVRQO0FBWWYsY0FBVSxzQ0FaSzs7QUFjZixZQUFRLGdCQUFTLE1BQVQsRUFBZ0IsSUFBaEIsRUFBcUIsS0FBckIsRUFBMkIsT0FBM0IsRUFBb0M7QUFDeEMsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLENBQUosRUFBcUI7QUFDakIsbUJBQU8sb0JBQUMsS0FBRCxDQUFPLEtBQVAsQ0FBYSxPQUFiLE9BQVA7QUFDSDs7QUFFRCxZQUFJLE1BQU0sRUFBRSxHQUFGLENBQU0sSUFBTixFQUFZLDJCQUFaLEVBQXlDLENBQXpDLENBQVY7QUFDQSxZQUFJLGVBQWUsTUFBTSxLQUFOLENBQVksWUFBL0I7O0FBRUEsZUFDSSxvQkFBQyxZQUFELElBQWMsT0FBTSxTQUFwQixFQUE4QixNQUFLLFFBQW5DLEVBQTRDLFFBQVEsR0FBcEQsR0FESjtBQUdIO0FBekJjLENBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHBhd2VscG9zZWwgb24gMDQvMTEvMjAxNi5cclxuICovXHJcblxyXG5TdGFnZS5kZWZpbmVXaWRnZXQoe1xyXG4gICAgaWQ6IFwic2VydmVyc051bVwiLFxyXG4gICAgbmFtZTogXCJOdW1iZXIgb2Ygc2VydmVyc1wiLFxyXG4gICAgZGVzY3JpcHRpb246ICdOdW1iZXIgb2Ygc2VydmVycycsXHJcbiAgICBpbml0aWFsV2lkdGg6IDIsXHJcbiAgICBpbml0aWFsSGVpZ2h0OiAyLFxyXG4gICAgY29sb3IgOiBcImdyZWVuXCIsXHJcbiAgICBzaG93SGVhZGVyOiBmYWxzZSxcclxuICAgIGlzUmVhY3Q6IHRydWUsXHJcbiAgICBpbml0aWFsQ29uZmlndXJhdGlvbjogW1xyXG4gICAgICAgIHtpZDogXCJwb2xsaW5nVGltZVwiLCBkZWZhdWx0OiA1fVxyXG4gICAgXSxcclxuICAgIGZldGNoVXJsOiAnW21hbmFnZXJdL25vZGUtaW5zdGFuY2VzP19pbmNsdWRlPWlkJyxcclxuXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLHRvb2xib3gpIHtcclxuICAgICAgICBpZiAoXy5pc0VtcHR5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiA8U3RhZ2UuQmFzaWMuTG9hZGluZy8+O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG51bSA9IF8uZ2V0KGRhdGEsIFwibWV0YWRhdGEucGFnaW5hdGlvbi50b3RhbFwiLCAwKTtcclxuICAgICAgICBsZXQgS2V5SW5kaWNhdG9yID0gU3RhZ2UuQmFzaWMuS2V5SW5kaWNhdG9yO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8S2V5SW5kaWNhdG9yIHRpdGxlPVwiU2VydmVyc1wiIGljb249XCJzZXJ2ZXJcIiBudW1iZXI9e251bX0vPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pOyJdfQ==
