'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.profile.beta-uiController', [])
      .controller('BetaUiController', BetaUiController);

  BetaUiController.$inject = ["$rootScope", "$scope", "$location", "$window", "HeaderService", "CONST","UIUtilService", "CedarUser", "QueryParamUtilsService"];

  function BetaUiController($rootScope, $scope, $location,$window, HeaderService, CONST, UIUtilService, CedarUser, QueryParamUtilsService) {

    $rootScope.pageTitle = 'BetaUI';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.PRIVACY;
    HeaderService.configure(pageId);

    $scope.toggleBetaUI = function () {
      CedarUser.toggleNewUI();
      console.log('Cedar User', CedarUser.getUIPreferences());
    }

    $scope.goToDashboardOrBack = function () {
      //vm.searchTerm = null;
      UIUtilService.activeLocator = null;
      UIUtilService.activeZeroLocator = null;
      var path = $location.path();
      var hash = $location.hash();
      var baseUrl = '/dashboard';
      if (path != baseUrl) {
        var queryParams = {};
        var sharing = QueryParamUtilsService.getSharing();
        if (sharing) {
          queryParams['sharing'] = sharing;
        }
        var folderId = QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId();
        if (folderId) {
          queryParams['folderId'] = folderId;
        }
        /*if (params.search) {
         queryParams['search'] = params.search;
         }*/
      }
      var url = $rootScope.util.buildUrl(baseUrl, queryParams);
      if (hash) {
        url += '#' + hash;
      }
      $location.url(url);
      $window.scrollTo(0, 0);

    };


  }

});
