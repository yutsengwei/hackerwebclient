(function() {
	angular.module('AngularMapModule')
		.controller('ChatController', ChatController);

	ChatController.$injector = ['$scope', '$firebaseArray', '$firebaseObject', '$firebaseAuth']
	function ChatController($scope, $firebaseArray, $firebaseObject, $firebaseAuth) {

		var vm = this;
		var fbref = new Firebase("https://hifirebase.firebaseio.com/");
		var fireRef = new Firebase("https://hifirebase.firebaseio.com/message");
		
		vm.messageAry = $firebaseArray(fireRef);
		vm.loginUser = {};
  		vm.authData = {};
  		
  		vm.addMessage = addMessage;
  		vm.isLogin = false;
  		vm.loginFB = loginFB;

		function loginFB() {
    		fbref.authWithOAuthPopup("facebook", function(error, authData) {
    			if(error) {
    				console.log(error);
    			} else {
		      		vm.isLogin = true;
		      		console.log(authData);
		     		console.log("Logged in as:", authData.facebook.displayName);
		      		vm.loginUser.name = authData.facebook.displayName;
		      		vm.authData = authData;
	      		}
    	
   			}, 
   			{
  				remember: "sessionOnly",
  				scope: "email,user_likes"
			});
  		}

  		function addMessage(msg) {

			$scope.msg = "";
  			if(vm.isLogin) {

	    		vm.messageAry.$add({
				    text : msg,
				    name : vm.loginUser.name,
				    picture: vm.authData.facebook.cachedUserProfile.picture.data.url
			    });
    		} else {
    			console.log('add data');
    			vm.messageAry.$add({text:msg});
    		}
  		}
	}

})();