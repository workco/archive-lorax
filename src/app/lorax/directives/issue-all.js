/**
 * @fileOverview Issue all directive
 * @author <a href="mailto:chris@work.co">Chris James</a>
 */
define(['jquery', 'jquery-scrollie'], function ($) {
    'use strict';

    /**
     * Issue All directive
     */
    var IssueAllDirective = function () {
        return {
            restrict: 'A',
            scope: true,
            controller: IssueAllCtrl,
            link: IssueAllLinkFn,
            templateUrl: '/app/lorax/directives/issue-all.tpl.html'
        };
    };

    /**
     * Controller for issue all directive
     * @constructor
     */
    var IssueAllCtrl = function (
        $scope,
        $route,
        $timeout,
        $rootScope,
        $location,
        dataService,
        windowService,
        exploreService
    ) {

        this._$scope = $scope;
        this._$route = $route;
        this._$timeout = $timeout;
        this._$rootScope = $rootScope;
        this._$location = $location;
        this._$scope.dataService = dataService;
        this._$scope.detail = {
            currentIssue : '',
            scrollTo: this.scrollToIssue.bind(this),
            nextIssue: this.nextIssue.bind(this)
        };

        // set detail mode on, adds body class
        windowService.setDetailMode(true);
        exploreService.switchView('detail');

        $scope.$on('$destroy', function () {
            // set detail mode off, removes body class
            windowService.setDetailMode(false);
            exploreService.switchView('explore');
        });

        // get model
        this._$scope.dataService.getMain().then(function (model) {
            this._$scope.detail.model = model;
        }.bind(this));
    };

    IssueAllCtrl.$inject = [
        '$scope',
        '$route',
        '$timeout',
        '$rootScope',
        '$location',
        'dataService',
        'windowService',
        'exploreService'
    ];

    IssueAllCtrl.prototype.scrollToIssue = function (issue, topic) {
        // get first issue from topic
        if (topic && !issue) {
            issue = this._$scope.detail.model.getTopicById(topic).getIssues()[0].getId();
        }

        // find issue offset
        var offset = 0;
        if (issue && $('#' + issue).length) {
            offset = $('#' + issue).offset().top - 138;
        }

        // scroll to offset
        $('body').animate({scrollTop: offset}, 500);

        this._$scope.detail.currentIssue = issue;
    };

    IssueAllCtrl.prototype.onRouteChange = function (evt, newParam) {
        var topic = newParam.params.topic;
        var issue = newParam.params.issue;
        this.scrollToIssue(issue, topic);
    };

    IssueAllCtrl.prototype.nextIssue = function () {
        this._$scope.detail.currentIssue =
            $('#' + this._$scope.detail.currentIssue).next().attr('id');

        if (this._$scope.detail.currentIssue) {
            this._$scope.detail.scrollTo(this._$scope.detail.currentIssue);
        }
    };

    /**
     * Link function for Issue All directive
     * @param {object} scope      Angular scope.
     * @param {JQuery} iElem      Detail wrapper jQuery element.
     */
    var IssueAllLinkFn = function (scope, iElem, iAttrs, controller) {

        // wait for everything to be rendered
        controller._$timeout(function () {
            var topic = controller._$location.search().topic;
            var issue = controller._$location.search().issue;

            controller.scrollToIssue(issue, topic);

            controller._$rootScope.$on('$routeUpdate', controller.onRouteChange.bind(controller));
            controller._$scope.$on('$destroy', controller.onRouteChange.bind(controller));

            // change bg mode according to issue
            var $body = $('body');
            var $detail = $('.detail');
            var status = $detail.eq(0).attr('data-issue-status');

            $body.attr('data-bg-mode', status);

            $detail.scrollie({
                scrollOffset : 138,
                ScrollingOutOfView : function onScrollOutOfView (elem) {
                    status = elem.attr('data-issue-status');
                    $body.attr('data-bg-mode', status);
                }
            });
        }.bind(controller), 500);
    };

    return IssueAllDirective;
});
