(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.defineWidget({
    id: "pluginsNum",
    name: "Number of plugins",
    description: 'Number of plugins',
    initialWidth: 2,
    initialHeight: 2,
    color: "teal",
    showHeader: false,
    isReact: true,
    initialConfiguration: [{ id: "pollingTime", default: 5 }],
    fetchUrl: '[manager]/plugins?_include=id',

    render: function render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return React.createElement(Stage.Basic.Loading, null);
        }

        var num = _.get(data, "metadata.pagination.total", 0);
        var KeyIndicator = Stage.Basic.KeyIndicator;

        return React.createElement(KeyIndicator, { title: "Plugins", icon: "plug", number: num });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzXFxwbHVnaW5zTnVtXFxzcmNcXHdpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFJQSxNQUFNLFlBQU4sQ0FBbUI7QUFDZixRQUFJLFlBRFc7QUFFZixVQUFNLG1CQUZTO0FBR2YsaUJBQWEsbUJBSEU7QUFJZixrQkFBYyxDQUpDO0FBS2YsbUJBQWUsQ0FMQTtBQU1mLFdBQVEsTUFOTztBQU9mLGdCQUFZLEtBUEc7QUFRZixhQUFTLElBUk07QUFTZiwwQkFBc0IsQ0FDbEIsRUFBQyxJQUFJLGFBQUwsRUFBb0IsU0FBUyxDQUE3QixFQURrQixDQVRQO0FBWWYsY0FBVSwrQkFaSzs7QUFjZixZQUFRLGdCQUFTLE1BQVQsRUFBZ0IsSUFBaEIsRUFBcUIsS0FBckIsRUFBMkIsT0FBM0IsRUFBb0M7QUFDeEMsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLENBQUosRUFBcUI7QUFDakIsbUJBQU8sb0JBQUMsS0FBRCxDQUFPLEtBQVAsQ0FBYSxPQUFiLE9BQVA7QUFDSDs7QUFFRCxZQUFJLE1BQU0sRUFBRSxHQUFGLENBQU0sSUFBTixFQUFZLDJCQUFaLEVBQXlDLENBQXpDLENBQVY7QUFDQSxZQUFJLGVBQWUsTUFBTSxLQUFOLENBQVksWUFBL0I7O0FBRUEsZUFDSSxvQkFBQyxZQUFELElBQWMsT0FBTSxTQUFwQixFQUE4QixNQUFLLE1BQW5DLEVBQTBDLFFBQVEsR0FBbEQsR0FESjtBQUdIO0FBekJjLENBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHBhd2VscG9zZWwgb24gMDQvMTEvMjAxNi5cclxuICovXHJcblxyXG5TdGFnZS5kZWZpbmVXaWRnZXQoe1xyXG4gICAgaWQ6IFwicGx1Z2luc051bVwiLFxyXG4gICAgbmFtZTogXCJOdW1iZXIgb2YgcGx1Z2luc1wiLFxyXG4gICAgZGVzY3JpcHRpb246ICdOdW1iZXIgb2YgcGx1Z2lucycsXHJcbiAgICBpbml0aWFsV2lkdGg6IDIsXHJcbiAgICBpbml0aWFsSGVpZ2h0OiAyLFxyXG4gICAgY29sb3IgOiBcInRlYWxcIixcclxuICAgIHNob3dIZWFkZXI6IGZhbHNlLFxyXG4gICAgaXNSZWFjdDogdHJ1ZSxcclxuICAgIGluaXRpYWxDb25maWd1cmF0aW9uOiBbXHJcbiAgICAgICAge2lkOiBcInBvbGxpbmdUaW1lXCIsIGRlZmF1bHQ6IDV9XHJcbiAgICBdLFxyXG4gICAgZmV0Y2hVcmw6ICdbbWFuYWdlcl0vcGx1Z2lucz9faW5jbHVkZT1pZCcsXHJcblxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcix0b29sYm94KSB7XHJcbiAgICAgICAgaWYgKF8uaXNFbXB0eShkYXRhKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gPFN0YWdlLkJhc2ljLkxvYWRpbmcvPjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBudW0gPSBfLmdldChkYXRhLCBcIm1ldGFkYXRhLnBhZ2luYXRpb24udG90YWxcIiwgMCk7XHJcbiAgICAgICAgbGV0IEtleUluZGljYXRvciA9IFN0YWdlLkJhc2ljLktleUluZGljYXRvcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPEtleUluZGljYXRvciB0aXRsZT1cIlBsdWdpbnNcIiBpY29uPVwicGx1Z1wiIG51bWJlcj17bnVtfS8+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il19
