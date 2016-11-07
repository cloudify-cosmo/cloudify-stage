(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.addPlugin({
    id: "serversNum",
    name: "Number of servers",
    description: 'Number of servers',
    initialWidth: 4,
    initialHeight: 2,
    color: "green",
    showHeader: false,
    isReact: true,

    fetchData: function fetchData(plugin, context, pluginUtils) {
        return new Promise(function (resolve, reject) {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/node-instances?_include=id',
                dataType: 'json'
            }).done(function (nodes) {
                resolve({ number: nodes.metadata.pagination.total });
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

        return React.createElement(KeyIndicator, { title: "Servers", icon: "server", number: data.number });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3NlcnZlcnNOdW0vc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFJQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDWixRQUFJLFlBRFE7QUFFWixVQUFNLG1CQUZNO0FBR1osaUJBQWEsbUJBSEQ7QUFJWixrQkFBYyxDQUpGO0FBS1osbUJBQWUsQ0FMSDtBQU1aLFdBQVEsT0FOSTtBQU9aLGdCQUFZLEtBUEE7QUFRWixhQUFTLElBUkc7O0FBVVosZUFBVyxtQkFBUyxNQUFULEVBQWdCLE9BQWhCLEVBQXdCLFdBQXhCLEVBQXFDO0FBQzVDLGVBQU8sSUFBSSxPQUFKLENBQWEsVUFBQyxPQUFELEVBQVMsTUFBVCxFQUFvQjtBQUNwQyx3QkFBWSxNQUFaLENBQW1CLEdBQW5CLENBQXVCO0FBQ25CLHFCQUFLLFFBQVEsYUFBUixLQUEwQixzQ0FEWjtBQUVuQiwwQkFBVTtBQUZTLGFBQXZCLEVBR0csSUFISCxDQUdRLFVBQUMsS0FBRCxFQUFVO0FBQ2Qsd0JBQVEsRUFBQyxRQUFRLE1BQU0sUUFBTixDQUFlLFVBQWYsQ0FBMEIsS0FBbkMsRUFBUjtBQUNILGFBTEQsRUFLRyxJQUxILENBS1EsTUFMUjtBQU1ILFNBUE0sQ0FBUDtBQVFILEtBbkJXOztBQXFCWixZQUFRLGdCQUFTLE1BQVQsRUFBZ0IsSUFBaEIsRUFBcUIsS0FBckIsRUFBMkIsT0FBM0IsRUFBbUMsV0FBbkMsRUFBZ0Q7QUFDcEQsWUFBSSxDQUFDLElBQUwsRUFBVztBQUNQLG1CQUFPLFlBQVksa0JBQVosRUFBUDtBQUNIOztBQUVELFlBQUksS0FBSixFQUFXO0FBQ1AsbUJBQU8sWUFBWSxnQkFBWixDQUE2QixLQUE3QixDQUFQO0FBQ0g7O0FBRUQsWUFBSSxlQUFlLE1BQU0sS0FBTixDQUFZLFlBQS9COztBQUVBLGVBQ0ksb0JBQUMsWUFBRCxJQUFjLE9BQU0sU0FBcEIsRUFBOEIsTUFBSyxRQUFuQyxFQUE0QyxRQUFRLEtBQUssTUFBekQsR0FESjtBQUdIO0FBbkNXLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBwYXdlbHBvc2VsIG9uIDA0LzExLzIwMTYuXG4gKi9cblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJzZXJ2ZXJzTnVtXCIsXG4gICAgbmFtZTogXCJOdW1iZXIgb2Ygc2VydmVyc1wiLFxuICAgIGRlc2NyaXB0aW9uOiAnTnVtYmVyIG9mIHNlcnZlcnMnLFxuICAgIGluaXRpYWxXaWR0aDogNCxcbiAgICBpbml0aWFsSGVpZ2h0OiAyLFxuICAgIGNvbG9yIDogXCJncmVlblwiLFxuICAgIHNob3dIZWFkZXI6IGZhbHNlLFxuICAgIGlzUmVhY3Q6IHRydWUsXG5cbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKHBsdWdpbixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmw6IGNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9ub2RlLWluc3RhbmNlcz9faW5jbHVkZT1pZCcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSkuZG9uZSgobm9kZXMpPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe251bWJlcjogbm9kZXMubWV0YWRhdGEucGFnaW5hdGlvbi50b3RhbH0pO1xuICAgICAgICAgICAgfSkuZmFpbChyZWplY3QpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RMb2FkaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdEVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBLZXlJbmRpY2F0b3IgPSBTdGFnZS5CYXNpYy5LZXlJbmRpY2F0b3I7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxLZXlJbmRpY2F0b3IgdGl0bGU9XCJTZXJ2ZXJzXCIgaWNvbj1cInNlcnZlclwiIG51bWJlcj17ZGF0YS5udW1iZXJ9Lz5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
