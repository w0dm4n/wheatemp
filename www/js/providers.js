angular.module('starter.controllers', [])
  .provider('apixuProvider', function ApixuProvider() {
    this.$get = function() {
      return {
        test: function () {
          console.log("Coucou");
        }
      }
    }
  });
