(function() {
	angular.module('AngularMapModule')
		.service('ChatService', ChatService);

	ChatService.$injector = ['$firebaseArray', '$firebaseObject', '$firebaseAuth']
	function ChatService($firebaseArray, $firebaseObject, $firebaseAuth) {

		var _this = this;
		var fbref = new Firebase("https://hifirebase.firebaseio.com/");
		var fireRef = new Firebase("https://hifirebase.firebaseio.com/message");
  		var messageAry = $firebaseArray(fireRef);		

		var login = false;
  		var auth = {};

		//public function
		_this.loginFB = loginFB;
		_this.addMessage = addMessage;
		_this.isLogin = function () {
			return login;
		}
		_this.getAuth = function () {
			return auth;
		}
		_this.getMessages = function() {
			return messageAry;
		}

		//private 
		function loginFB() {
    		fbref.authWithOAuthPopup("facebook", function(error, authData) {
    			if(error) {
    				console.log(error);
    			} else {
		      		login = true;
		      		angular.extend(auth, authData);
	      		}
    	
   			}, 
   			{
  				remember: "sessionOnly",
  				scope: "email,user_likes"
			});
  		}

  		function addMessage(msg) {
  			if(login) {

	    		messageAry.$add({
				    text : msg,
				    name : auth.facebook.displayName.name,
				    picture: auth.facebook.cachedUserProfile.picture.data.url
			    });
    		} else {
    			console.log('add data');
    			messageAry.$add({text:msg});
    		}
  		}
	}
}

)();