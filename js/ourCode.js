
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyABVkwZ1_4qkrhCqbCq6tufxt-1njqd7xs",
    authDomain: "webfinal-cd72d.firebaseapp.com",
    databaseURL: "https://webfinal-cd72d.firebaseio.com",
    projectId: "webfinal-cd72d",
    storageBucket: "webfinal-cd72d.appspot.com",
    messagingSenderId: "999586594539"
  };
  firebase.initializeApp(config);
          var currentUser;
        firebase.auth().onAuthStateChanged(function (user) { // firebase user state change
            
            if (user) {
				      console.log("inside");
                currentUser = user;
                var user = firebase.database().ref().root.child(currentUser.uid);
                var balance= user.child('Balance');
                var cart = user.child('Cart');
                var name = user.child('Name');
                cart.once('value').then(function (snapshot) {
                    var cartValue = snapshot.val();
                    	console.log(cartValue);
                    if (cartValue == null || cartValue == "undefined" ) {
						balance.set(1000);
						cart.set(0);
						name.set(currentUser.email);
                    } 
                    $("#cartId").text("$"+cartValue);
                    
                });
                 if(document.getElementById("title").textContent == "Money Send"){
                 	firebase.database().ref().root.child(currentUser.uid).child("Balance").on('value', function(snapshot){
                 		$("#balance").text("Your Balance: $"+snapshot.val());
                 		});
                 	loaded();
                }
                if(document.getElementById("title").textContent == "Buy Status"){

                	$("#buyStatus").text(localStorage.getItem("buyStatus"));
                }
                if(document.getElementById("title").textContent == "Profile Edit" || document.getElementById("title").textContent == "Profile"){
                	user.once('value').then(function (snapshot) {
                	var userValue = snapshot.val();
                	$("#name").text("User Name: "+userValue.Name );
                    $("#address").text("User Address: "+userValue.Address );
                	});
          

                		firebase.storage().ref().child('images/' + currentUser.uid + '.jpg').getDownloadURL().then(function(url) {
					  // Or inserted into an <img> element:
					  var img = document.getElementById('ProfileImg');
					  img.src = url;
					}).catch(function(error) {
					  // Handle any errors
					  console.log(error);
					});
                }
                if(document.getElementById("title").textContent == "Details" || document.getElementById("title").textContent == "Buy"){
                	var theList = user.child('itemsList');
                	var itemsData = [];
                	var itemsAmount = [];
                	theList.once('value').then(function (snapshot) {
                		snapshot.forEach(function(childSnapshot) {
               			itemsData.push(childSnapshot.key);
               			itemsAmount.push(childSnapshot.val());
               			  });
                			var n = 0;
                			itemsData.forEach(function(element) {
                				//$("#items").text(document.getElementById("items").textContent +  " \n Item Name:  " +  element + "  Amount: "+ itemsAmount[n]);
                				var li = document.createElement("li");
 						 var inputValue = " Item Name:  " +  element + ";  Amount: "+ itemsAmount[n];
 						 var t = document.createTextNode(inputValue);
 						 li.appendChild(t);
						  if (inputValue === '') {
							    alert("You must write something!");
							  } else {
							    document.getElementById("items").appendChild(li);
							  }
                				n++;
                			  });

                	//	$("#items").text(" Item Name: " + itemsData[1] + " Amount: "+ itemsAmount[1]); 
                		console.log("its " + document.getElementById("items").textContent );
                	});

                user.once('value').then(function (snapshot) {
                	var userValue = snapshot.val();
                    $("#name").text("User Name: "+userValue.Name );             	
				});
				}
                if(document.getElementById("title").textContent == "Profile" || document.getElementById("title").textContent == "Buy"){

                user.once('value').then(function (snapshot) {
                    var userValue = snapshot.val();
                    $("#name").text("User Name: "+userValue.Name );

                    $("#cart").text("Cart Amount:  $"+userValue.Cart ); 
                    $("#amount").text("Money Amount:  $"+userValue.Balance );   
                    

                });
                }


                //still connected
            } else {
                console.log("else");
                location.href = "login.html";
            }
        });
   			function profile(){location.href = "profile.html";}
        	function home(){location.href = "index.html";}
        	function ProfileEdit(){location.href = "ProfileEdit.html";}
        	function cancelBuy() {
        		var user = firebase.database().ref().root.child(currentUser.uid);
        		user.child('Cart').set(0);
        		user.child('itemsList').set(null);
        		location.reload();
        	}
        	function buyBtn() {
        		console.log("i presed log");

        		var user = firebase.database().ref().root.child(currentUser.uid);
        		var balance= user.child('Balance');
                var cart = user.child('Cart');
                 var itemsList = user.child('itemsList');
                	user.once('value').then(function (snapshot) {
                	var userValue = snapshot.val();
                	var balanceValue= userValue.Balance;
                	var cartValue = userValue.Cart;
                	var nameValue = userValue.Name;
                	var itemsListValue = userValue.itemsList;
                	 var getInput;
                	if(cartValue == 0){
                		getInput = nameValue+ " Your Cart is Empty! fill it up ";
                	}
                	else if((balanceValue - cartValue) >0 ){
                		balance.set(balanceValue - cartValue);
                		cart.set(0);
                		getInput =  nameValue+ " You Buy successfuly! the order is on the way.";
                		itemsList.set(null);
                	} else{
                		getInput =  nameValue+ " Sorry you dont have enogh Money :( " ;
                		console.log("failed to Buy");
                	}
                	 localStorage.setItem("buyStatus",getInput);
                		location.href = "buyStatus.html";
                	});

        	}
        	function editBtn(){
        		console.log('edit clicked');
				let name = $("#nameEdit").val();
				 var userName = firebase.database().ref().root.child(currentUser.uid).child('Name');
				 if(name == ''){
				 	alert("Write something...");
				 }else{
				 userName.set(name);	
				 }
				 
				 location.href = "ProfileEdit.html";
        	}
            function addressBtn(){
                console.log('edit clicked');
                let address = $("#addressEdit").val();
                 var userName = firebase.database().ref().root.child(currentUser.uid).child('Address');
                 if(name == ''){
                    alert("Write something...");
                 }else{
                 userName.set(address);    
                 }
                 
                 location.href = "ProfileEdit.html";
            }
        		

        	$(document).ready(function(){
			$("#uploadBtn").click(function(){
				console.log('upload clicked');
				$("#fileInput").click();
			});
			
			$("#fileInput").change(function(e){
				if(e.target.files.length == 0){
					console.log('cancelled');
					return;
				}
				console.log('picked file:', e.target.files[0]);
				var storageRef = firebase.storage().ref();
				var name = storageRef.child("images/" + currentUser.uid + ".jpg");
				$("#url").text('uploading...');
				name.put(e.target.files[0]).then(function(snapshot){
						name.getDownloadURL().then(function(url){
							//$("#url").text(url).attr('href', url);
							location.reload();
						}).catch(function(err){ console.log(err); });
				}).catch(function(err){ console.log(err); $("#url").text('didnt work out.. click above again!');});		
			});
		});

			function buyItem (price,itemName) {

			var	usersRef = firebase.database().ref(currentUser.uid);

			var allItems = firebase.database().ref().root.child('AllItems');
			var allItemsItem = allItems.child(itemName);
			var itemPrice = allItemsItem.child('price');
			
			itemPrice.set(price);
			var usersOwn = allItemsItem.child('usersOwn');
			var owner = usersOwn.child(currentUser.uid);
			owner.once('value').then(function (snapshot) {
			owner.set(snapshot.val() + 1);
			});

			
			var itemsList = usersRef.child('itemsList');
			var newItem =itemsList.child(itemName);
			
			newItem.once('value').then(function (snapshot) {
			newItem.set(snapshot.val() + 1);
			});

			
			var cart = usersRef.child('Cart');
			cart.on('value', function (snapshot) {
				 $("#cartId").text("$"+snapshot.val());
			//var cartId = document.querySelector('#cartId');
			//cartId.textContent = snapshot.val();
			console.log(snapshot.val());
        });
			cart.once('value').then(function (snapshot) {
				cart.set(snapshot.val()+ price);
			});
			
			}

        function  singOut () { //user sign out      
                    firebase.auth().signOut().then(function () {});
                    // Sign-out successful.
                }
