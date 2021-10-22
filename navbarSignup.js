firebase.initializeApp(firebaseConfig);
var auth = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
        db = firebase.firestore()
		db.collection("userInfo").doc(user.uid).get()
			.then(function (doc) {
				if (doc.exists) {
                    var downloadURL = doc.data().downloadURL;
                    myimg.src = downloadURL;
                }
            })
            document.getElementById('navbar navbar-light navbar-expand-md').innerHTML = `<div class="container-fluid">
            <a class="navbar-brand" href="/index.html">PrograMeet</a>
                <div class="collapse navbar-collapse" id="navcol-1">

            </div>
            <hr>`

    } else {
        document.getElementById('navbar navbar-light navbar-expand-md').innerHTML = `<div class="container-fluid">
        <a class="navbar-brand" href="/index.html">PrograMeet</a>
        </div>
        <hr>`
    }
})
function logout(){
    firebase.auth().signOut().then(function() {
  console.log('User Logged Out!');
}).catch(function(error) {
  console.log(error);
});
}
      
    
