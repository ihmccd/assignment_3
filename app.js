(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com/menu_items.json')
.directive('foundItems', FoundItemsDirective);

FoundItemsDirective.$inject = ['$http', 'ApiBasePath'];

function FoundItemsDirective() {
  var ddo = {
      templateUrl: "foundlist.html",
      scope: {
        items: '<',
        title: '@title',
        onRemove: '&'
      }
  };

  return ddo;
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http,ApiBasePath) {
  var service = this;
  service.getItems = function(searchTerm){
    var foundArr=[];
	  return $http({
      method: "GET",
      url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
    }).then(function(result){
		var searchArr=result.data.menu_items;
		searchArr.forEach(function(element){
				//console.log(element,element.name.toLowerCase(), searchTerm);
			if(element.name.toLowerCase().indexOf(searchTerm.toLowerCase())!=-1){
				foundArr.push(element);
			}
			//console.log(foundArr);
		});
		return foundArr;
	 })
  }
}

NarrowItDownController.$inject=['MenuSearchService']
function NarrowItDownController (MenuSearchService, searchTerm){
	var menu=this;
	menu.items=[];
	menu.getItemList= function(){
			var promise = MenuSearchService.getItems(menu.searchTerm);
			promise.then(function(response){
				menu.items=response;
				if (menu.items.length>0){
				menu.title= 'Found ' + menu.items.length + ' items.';
				}
				else{
				menu.title='Nothing found.'
				}
			})
			.catch(function(error){
				menu.error='Nothing found';
			})
	}
	menu.removeItem = function (itemIndex) {
    //console.log("'this' is: ", this);
    menu.items.splice(itemIndex,1);
    if(menu.items.length>0){
      menu.title= 'Found ' + menu.items.length + ' items.';
    }
    else{
      menu.title='Nothing found.'
    }
  };
}





})();
