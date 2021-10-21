var auth = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
          db = firebase.firestore()
          db.collection("userInfo").doc(user.uid).get()
              .then(function (doc) {
                  if (doc.exists) {
                      var downloadURL = doc.data().downloadURL;
                    //   myimg.src = downloadURL;
                  }
              })
              document.getElementById('navbar navbar-light navbar-expand-md bg-white py-3').innerHTML =
              `
              <div class="container"><a class="navbar-brand text-primary" href="index.html">Programeet</a><button data-toggle="collapse" class="navbar-toggler border-0" data-target="#navcol-1"><span><i class="fas fa-bars text-primary"></i></span></button>
              <div class="collapse navbar-collapse" id="navcol-1">
                  <form class="form-inline mr-auto" target="_self">
                      <div class="form-group"><label for="search-field"><i class="fa fa-search" style="margin-right: 7px;"></i></label><input class="form-control search-field" type="search" id="search-field" name="search"></div>
                  </form>
                  <ul class="navbar-nav mx-auto">
                      <li class="nav-item"><a class="nav-link active" href="/explore.html">Explore<br></a></li>
                      <li class="nav-item"><a class="nav-link" href="/contact.html" style="color: rgba(0,0,0,0.9);">Contact<br></a></li>
                      <li class="nav-item"><a class="nav-link" href="/ask.html" style="color: rgba(0,0,0,0.9);">Ask</a></li>
                      <li class="nav-item"><a class="nav-link" href="/events.html" style="color: rgba(0,0,0,0.9);">Events</a></li>
                      <!-- <li class="nav-item"><a class="nav-link" href="" style="color: rgba(0,0,0,0.9);">Form</a></li> --!>
                      <li class="nav-item"><a class="nav-link" href="/resources.html" style="color: rgba(0,0,0,0.9);">Resources</a></li>
                      <li class="nav-item" style="padding-right: 0.4rem;padding-left: .4rem;"><a class="nav-link" href="/settings.html"><img src="assets/img/settings.jpg" style=" width:25px"></a></li>
                      <li class="nav-item" style="padding-right: 0.4rem;padding-left: .4rem;"><a href="/chat.html" class="nav-link" id="chatIcon">
                      <img src="assets/img/chat.png" style=" width:25px">
                      <span class="badge" id="notification2">0</span>
                      </a>
                      </li>
                  </ul><button class="btn btn-primary" type="button" onclick="logout()" style="background: var(--primary);">Log Out</button>
              </div>
          </div>
          
              `
  
      } else {
          document.getElementById('navbar navbar-light navbar-expand-md bg-white py-3').innerHTML = 
 
          `
          <div class="container"><a class="navbar-brand text-primary" href="index.html">Programeet</a><button data-toggle="collapse" class="navbar-toggler border-0" data-target="#navcol-1"><span><i class="fas fa-bars text-primary"></i></span></button>
              <div class="collapse navbar-collapse" id="navcol-1">
                  <ul class="nav navbar-nav mx-auto">
                  <!-- <li class="nav-item"><a class="nav-link" href="/contact.html" style="color: rgba(0,0,0,0.9);">Contact<br></a></li>
                      <li class="nav-item"><a class="nav-link" href="/events.html" style="color: rgba(0,0,0,0.9);">Events</a></li>
                      
                      <li class="nav-item"><a class="nav-link" href="/resources.html" style="color: rgba(0,0,0,0.9);">Resources</a></li>
                      <li class="nav-item"><a class="nav-link active" href="/explore.html">Explore<br></a></li>  
                      --!>
                      <li class="nav-item"><a class="nav-link" href="/login.html" style="color: rgba(0,0,0,0.9);">Log In</a></li>
      
                  <li class="nav-item"><a href="/signup.html"><button class="btn btn-primary"  type="button">Sign Up</button></a></li>
                  
                  </ul>
              </div>
          </div>
      
          `
      }
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


  function NotificationCount() {
    let db = firebase.database().ref('notifications');
    db.orderByChild('sendTo').equalTo(currentUserKey).on('value', function (noti) {
        let notiArray = Object.values(noti.val());
        document.getElementById('notification2').innerHTML = notiArray.length;
    });
}