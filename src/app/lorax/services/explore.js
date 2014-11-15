define(function () {
    'use strict';

    var ExploreService = function ($location, $timeout) {
        this._$location = $location;
        this._$timeout = $timeout;
    };

    ExploreService.prototype.setCanvas = function (canvas) {
        this._explore = canvas;
        this._explore.init();
        this._explore.setEnterIssueCallback(this._onPressIssue.bind(this));
    };

    ExploreService.prototype.switchView = function (view) {
        if (view === 'explore') {
            this._explore.showExplore();
        } else if (view === 'topics') {
            this._explore.showTopics();
        } else if (view === 'issues') {
            this._explore.showIssues();
        } else if (view === 'detail') {
            this._explore.showDetail();
        }
    };

    ExploreService.prototype.onScroll = function () {
        this._explore.onScroll();
    };

    ExploreService.prototype._onPressIssue = function (topic, issue) {
        this._$timeout(function () {
            this._$location.url('/detail/?topic=' + topic + '&issue=' + issue);
        }.bind(this));
    };

    ExploreService.$inject = [
        '$location',
        '$timeout'
    ];

    return ExploreService;
});
