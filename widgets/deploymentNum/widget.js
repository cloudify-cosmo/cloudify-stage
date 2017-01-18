(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Created by pawelposel on 03/11/2016.
 */

Stage.defineWidget({
    id: "deploymentNum",
    name: "Number of deployments",
    description: 'Number of deployments',
    initialWidth: 2,
    initialHeight: 2,
    color: "violet",
    showHeader: false,
    isReact: true,
    initialConfiguration: [{ id: "pollingTime", default: 5 }],
    fetchUrl: '[manager]/deployments?_include=id',

    render: function render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return React.createElement(Stage.Basic.Loading, null);
        }

        var num = _.get(data, "metadata.pagination.total", 0);
        var KeyIndicator = Stage.Basic.KeyIndicator;

        return React.createElement(KeyIndicator, { title: "Deployments", icon: "cube", number: num });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzL2RlcGxveW1lbnROdW0vc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFJQSxNQUFNLFlBQU4sQ0FBbUI7QUFDZixRQUFJLGVBRFc7QUFFZixVQUFNLHVCQUZTO0FBR2YsaUJBQWEsdUJBSEU7QUFJZixrQkFBYyxDQUpDO0FBS2YsbUJBQWUsQ0FMQTtBQU1mLFdBQVEsUUFOTztBQU9mLGdCQUFZLEtBUEc7QUFRZixhQUFTLElBUk07QUFTZiwwQkFBc0IsQ0FDbEIsRUFBQyxJQUFJLGFBQUwsRUFBb0IsU0FBUyxDQUE3QixFQURrQixDQVRQO0FBWWYsY0FBVSxtQ0FaSzs7QUFjZixZQUFRLGdCQUFTLE1BQVQsRUFBZ0IsSUFBaEIsRUFBcUIsS0FBckIsRUFBMkIsT0FBM0IsRUFBb0M7QUFDeEMsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLENBQUosRUFBcUI7QUFDakIsbUJBQU8sb0JBQUMsS0FBRCxDQUFPLEtBQVAsQ0FBYSxPQUFiLE9BQVA7QUFDSDs7QUFFRCxZQUFJLE1BQU0sRUFBRSxHQUFGLENBQU0sSUFBTixFQUFZLDJCQUFaLEVBQXlDLENBQXpDLENBQVY7QUFDQSxZQUFJLGVBQWUsTUFBTSxLQUFOLENBQVksWUFBL0I7O0FBRUEsZUFDSSxvQkFBQyxZQUFELElBQWMsT0FBTSxhQUFwQixFQUFrQyxNQUFLLE1BQXZDLEVBQThDLFFBQVEsR0FBdEQsR0FESjtBQUdIO0FBekJjLENBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBwYXdlbHBvc2VsIG9uIDAzLzExLzIwMTYuXG4gKi9cblxuU3RhZ2UuZGVmaW5lV2lkZ2V0KHtcbiAgICBpZDogXCJkZXBsb3ltZW50TnVtXCIsXG4gICAgbmFtZTogXCJOdW1iZXIgb2YgZGVwbG95bWVudHNcIixcbiAgICBkZXNjcmlwdGlvbjogJ051bWJlciBvZiBkZXBsb3ltZW50cycsXG4gICAgaW5pdGlhbFdpZHRoOiAyLFxuICAgIGluaXRpYWxIZWlnaHQ6IDIsXG4gICAgY29sb3IgOiBcInZpb2xldFwiLFxuICAgIHNob3dIZWFkZXI6IGZhbHNlLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAge2lkOiBcInBvbGxpbmdUaW1lXCIsIGRlZmF1bHQ6IDV9XG4gICAgXSxcbiAgICBmZXRjaFVybDogJ1ttYW5hZ2VyXS9kZXBsb3ltZW50cz9faW5jbHVkZT1pZCcsXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLHRvb2xib3gpIHtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShkYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIDxTdGFnZS5CYXNpYy5Mb2FkaW5nLz47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbnVtID0gXy5nZXQoZGF0YSwgXCJtZXRhZGF0YS5wYWdpbmF0aW9uLnRvdGFsXCIsIDApO1xuICAgICAgICBsZXQgS2V5SW5kaWNhdG9yID0gU3RhZ2UuQmFzaWMuS2V5SW5kaWNhdG9yO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8S2V5SW5kaWNhdG9yIHRpdGxlPVwiRGVwbG95bWVudHNcIiBpY29uPVwiY3ViZVwiIG51bWJlcj17bnVtfS8+XG4gICAgICAgICk7XG4gICAgfVxufSk7Il19
