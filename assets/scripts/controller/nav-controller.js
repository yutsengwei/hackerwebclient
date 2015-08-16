(function() {
	angular.module('AngularMapModule')
		.controller('NavController', NavController);

	NavController.$injector = ['$scope', 'ChatService']
	function NavController($scope, ChatService) {

		var vm = this;
		
		vm.loginFB = ChatService.loginFB;

  	}
})();