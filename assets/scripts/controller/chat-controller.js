(function() {
	angular.module('AngularMapModule')
		.controller('ChatController', ChatController);

	ChatController.$injector = ['$scope', 'ChatService']
	function ChatController($scope, ChatService) {

		var vm = this;
		
		vm.messageAry = ChatService.getMessages();
  		vm.addMessage = function(msg) {
  			ChatService.addMessage(msg);
  		}

  	}
})();