var auth = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged(function (user) {
        document.getElementById('navbar navbar-light navbar-expand-md').innerHTML = `<div class="container-fluid">
        <a class="navbar-brand" href="/index.html">PrograMeet</a>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="nav navbar-nav">
                    <li class="nav-item"><a class="nav-link active" href="explore.html">Explore</a></li>
                    <!-- <li class="nav-item"><a class="nav-link active" href="ask.html">Ask</a></li> -->
                    <li class="nav-item"><a class="nav-link active" href="/contact.html">Contact</a></li>
                    <li class="nav-item"><a class="nav-link active" href="/events.html">Events</a></li>
                    <li class="nav-item"><a class="nav-link active" href="/form.html">Form</a></li>
                    <li class="nav-item"><a class="nav-link active" href="/resources.html">Resources</a></li>
                 <button class="btn btn-primary" type="button" onclick="logout()" style="margin-bottom: 19px;">Logout</button>
                </ul></div>
        </div>
        <hr>`
    })
function logout(){
    firebase.auth().signOut().then(function() {
  // Sign-out successful.
  console.log('User Logged Out!');
}).catch(function(error) {
  // An error happened.
  console.log(error);
});
}
      
    
