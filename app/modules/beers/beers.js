(function() {
    'use strict';

    angular.module('myApp.Beers', ['ngRoute', 'BeerServiceModule'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/beers', {
            templateUrl: 'modules/beers/list.html',
            controller: 'BeersListController as beersListCtrl'
        })
        .when('/beers/new', {
            templateUrl: 'modules/beers/details.html',
            controller: 'NewBeerController as beerCtrl'
        })
        .when('/beers/:id', {
            templateUrl: 'modules/beers/details.html',
            controller: 'BeerDetailsController as beerCtrl'
        });
    }])
    .controller('BeersListController', BeersListController)
    .controller('NewBeerController', NewBeerController)
    .controller('BeerDetailsController', BeerDetailsController);

    BeersListController.$inject = ['BeerService'];
    BeerDetailsController.$inject = ['BeerService', '$routeParams', '$location'];
    NewBeerController.$inject = ['BeerService', '$location'];

    function BeersListController(BeerService){
       var self = this;

       self.title = 'List of Beers';
       self.beerList = [];
       self.deleteBeer = deleteBeer;

       function findSuccessCallback(result) {
           self.beerList = result.data;
       };

       function findErrorCallback(result) {
            console.log(result);
       };

       function fillBeerList() {
            BeerService.find().then(
                findSuccessCallback,
                findErrorCallback
            );
       };

       function deleteBeer(beer) {
            console.log(beer);
            BeerService.remove(beer).then(
                function(result) {
                    console.log('deletado');
                    fillBeerList();
                },
                function(result) {
                    console.log('Erro ao deletar');
                }

            );
       }

       function initCtrl() {
            fillBeerList();
       };

       initCtrl();
    }

    function BeerDetailsController(BeerService, $routeParams, $location){
       var self = this;
       var id = $routeParams.id;

       self.title = 'Beer Details';
       self.saveBeer = saveBeer;
       self.beer = {};

       function saveBeer() {
            BeerService.update(self.beer).then(
                function(result) {
                    console.log("Salvo", result.data);
                    $location.path('/beers');

                },
                function(result) {
                    console.log("Erro ao salvar");
                }
            ); 
       };

       function getSuccessCallback(result) {
           self.beer = result.data;
       };

       function getErrorCallback(result) {
            console.log(result);
       };

       function getBeer() {
            if (id) {
                BeerService.get(id).then(
                    getSuccessCallback,
                    getErrorCallback
                );
            }
       };

       function initCtrl() {
            getBeer();
       };

       initCtrl();
    }

    function NewBeerController(BeerService, $location){
      var self = this;

      self.title = 'New Beer';
      self.saveBeer = saveBeer;
      self.beer = {};

      function saveBeer() {
        BeerService.create(self.beer).then(
          function(result) {
              console.log("Salvo", result.data);
              $location.path('/beers');
          },
          function(result) {
              console.log("Erro ao salvar");
          }
        ); 
      };
    }
})();