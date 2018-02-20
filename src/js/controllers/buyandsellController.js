'use strict';

angular.module('copayApp.controllers').controller('buyandsellController', function($scope, $ionicHistory, buyAndSellService, lodash, $window) {

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    // $scope.services = buyAndSellService.get();

    // if (lodash.isEmpty($scope.services))
    //   $ionicHistory.goBack();

    $scope.services = [

      {
        url : 'https://www.cryptopia.co.nz/Exchange/?market=XMCC_BTC',
        caption : 'Cryptopia'
      },
	  {
		url : 'https://www.coinexchange.io/market/XMCC/BTC',
		caption : 'coinExchange'
	  },
      {
        url : 'https://wallet.crypto-bridge.org/market/BRIDGE.XMCC_BRIDGE.BTC',
        caption : 'CryptoBridge'
      },
    ]
  });

  $scope.openMarket = function (url) {
    $window.open(url, '_self');
  };

});
