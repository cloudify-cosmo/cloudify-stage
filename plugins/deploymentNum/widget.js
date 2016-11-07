(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Created by pawelposel on 03/11/2016.
 */

Stage.addPlugin({
    id: "deploymentNum",
    name: "Number of deployments",
    description: 'Number of deployments',
    initialWidth: 4,
    initialHeight: 2,
    color: "violet",
    showHeader: false,
    isReact: true,

    fetchData: function fetchData(plugin, context, pluginUtils) {
        return new Promise(function (resolve, reject) {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/deployments?_include=id',
                dataType: 'json'
            }).done(function (deployments) {
                resolve({ number: deployments.metadata.pagination.total });
            }).fail(reject);
        });
    },

    render: function render(widget, data, error, context, pluginUtils) {
        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var KeyIndicator = Stage.Basic.KeyIndicator;

        return React.createElement(KeyIndicator, { title: "Deployments", icon: "cube", number: data.number });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2RlcGxveW1lbnROdW0vc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFJQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDWixRQUFJLGVBRFE7QUFFWixVQUFNLHVCQUZNO0FBR1osaUJBQWEsdUJBSEQ7QUFJWixrQkFBYyxDQUpGO0FBS1osbUJBQWUsQ0FMSDtBQU1aLFdBQVEsUUFOSTtBQU9aLGdCQUFZLEtBUEE7QUFRWixhQUFTLElBUkc7O0FBVVosZUFBVyxtQkFBUyxNQUFULEVBQWdCLE9BQWhCLEVBQXdCLFdBQXhCLEVBQXFDO0FBQzVDLGVBQU8sSUFBSSxPQUFKLENBQWEsVUFBQyxPQUFELEVBQVMsTUFBVCxFQUFvQjtBQUNwQyx3QkFBWSxNQUFaLENBQW1CLEdBQW5CLENBQXVCO0FBQ25CLHFCQUFLLFFBQVEsYUFBUixLQUEwQixtQ0FEWjtBQUVuQiwwQkFBVTtBQUZTLGFBQXZCLEVBR0csSUFISCxDQUdRLFVBQUMsV0FBRCxFQUFnQjtBQUNwQix3QkFBUSxFQUFDLFFBQVEsWUFBWSxRQUFaLENBQXFCLFVBQXJCLENBQWdDLEtBQXpDLEVBQVI7QUFDSCxhQUxELEVBS0csSUFMSCxDQUtRLE1BTFI7QUFNSCxTQVBNLENBQVA7QUFRSCxLQW5CVzs7QUFxQlosWUFBUSxnQkFBUyxNQUFULEVBQWdCLElBQWhCLEVBQXFCLEtBQXJCLEVBQTJCLE9BQTNCLEVBQW1DLFdBQW5DLEVBQWdEO0FBQ3BELFlBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUCxtQkFBTyxZQUFZLGtCQUFaLEVBQVA7QUFDSDs7QUFFRCxZQUFJLEtBQUosRUFBVztBQUNQLG1CQUFPLFlBQVksZ0JBQVosQ0FBNkIsS0FBN0IsQ0FBUDtBQUNIOztBQUVELFlBQUksZUFBZSxNQUFNLEtBQU4sQ0FBWSxZQUEvQjs7QUFFQSxlQUNJLG9CQUFDLFlBQUQsSUFBYyxPQUFNLGFBQXBCLEVBQWtDLE1BQUssTUFBdkMsRUFBOEMsUUFBUSxLQUFLLE1BQTNELEdBREo7QUFHSDtBQW5DVyxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgcGF3ZWxwb3NlbCBvbiAwMy8xMS8yMDE2LlxuICovXG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6IFwiZGVwbG95bWVudE51bVwiLFxuICAgIG5hbWU6IFwiTnVtYmVyIG9mIGRlcGxveW1lbnRzXCIsXG4gICAgZGVzY3JpcHRpb246ICdOdW1iZXIgb2YgZGVwbG95bWVudHMnLFxuICAgIGluaXRpYWxXaWR0aDogNCxcbiAgICBpbml0aWFsSGVpZ2h0OiAyLFxuICAgIGNvbG9yIDogXCJ2aW9sZXRcIixcbiAgICBzaG93SGVhZGVyOiBmYWxzZSxcbiAgICBpc1JlYWN0OiB0cnVlLFxuXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbihwbHVnaW4sY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5LmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiBjb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvZGVwbG95bWVudHM/X2luY2x1ZGU9aWQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pLmRvbmUoKGRlcGxveW1lbnRzKT0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtudW1iZXI6IGRlcGxveW1lbnRzLm1ldGFkYXRhLnBhZ2luYXRpb24udG90YWx9KTtcbiAgICAgICAgICAgIH0pLmZhaWwocmVqZWN0KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0TG9hZGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgS2V5SW5kaWNhdG9yID0gU3RhZ2UuQmFzaWMuS2V5SW5kaWNhdG9yO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8S2V5SW5kaWNhdG9yIHRpdGxlPVwiRGVwbG95bWVudHNcIiBpY29uPVwiY3ViZVwiIG51bWJlcj17ZGF0YS5udW1iZXJ9Lz5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
