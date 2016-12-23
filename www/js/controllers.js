angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    $scope.pages = [
      { title: 'Accueil', link: 'home' },
      { title: 'Informations', link: 'infos' }
    ];
  })
  .controller('HomeCtrl', function($scope, $timeout, $http, apixuProvider) {
    var values = [];
    var api_key = "ccccffdd46f94b809f1103632162112";
    var interval = null;
    $scope.data = { city: ""};

    function getCityInformations(city, callback) {
      $timeout(setLoading(false, $scope), 100);
      $http.get("http://api.apixu.com/v1/current.json", { params: { "key": api_key,
        "q": city } })
        .success(function(data) {
          callback(false, data);
        })
        .error(function(data) {
          callback(true, data);
        });

    }

    function isDone(currentValue) {
      var i = 0;
      for (var value in values) {
        if (values[value] == currentValue) {
          i++;
        }
      }
      return (i > 4);
    }

    function setLoading(boolean) {
      $scope.loading = boolean;
    }

    function checkCityContent() {
      if ($scope.data.city.length >= 3) {
        values.push($scope.data.city);
        if (isDone($scope.data.city) == true) {
          getCityInformations($scope.data.city, function(err, result) {
            if (err) {
              console.log("An error occured !");
              clearInterval(interval);
              values = [];
              interval = null;
              $timeout(setLoading(true, $scope), 100);
            }
            else {
              $scope.content = result;
            }
          });

          clearInterval(interval);
          values = [];
          interval = null;
        }
      }
    }

    $scope.onSearchChange = function () {
      if ($scope.data.city.length > 0) {
        apixuProvider.test();
        if (interval == null) {
          interval = setInterval(checkCityContent, 250);
        }
      }
      else {
        $timeout(setLoading(true, $scope), 100);
        clearInterval(interval);
        values = [];
        interval = null;
        $scope.content = null;
      }
    };
    $scope.loading = true;
  })
  .controller('ContentCtrl', function($scope, $ionicModal, $timeout) {
    $scope.wheater_data = angular.fromJson($scope.content);
    $scope.loading = true;
    //console.log($scope.content);
  }).provider('apixuProvider', function ApixuProvider() {
  this.$get = function() {
    return {
      test: function () {
        console.log("Coucou");
      }
    }
  }
});
