var currentUserKey = "";
var chatKey = "";
var friend_id = "";
var sendTo = "";

var data = "";
var db = firebase.database()
const nameRef = db.ref('users');
nameRef.on('value', gotData)
var testing = []

function gotData(data){
  var person = data.val();
  var keys = Object.keys(person)
  for(var i=0; i <keys.length; i++){
    var key = keys[i];
    var personsName = person[key].name;
    testing.push(personsName);
  }
  $("#search-field").autocomplete({
    source: testing,
    select: redirect,
  })
  var labelName;
  function redirect(event,ui){
    labelName = ui.item.label;
    var key = keys[i];
    for(var i=0; i <keys.length; i++){
      var key2 = keys[i];
      if(labelName == person[key2].name){
        console.log(person[key2].userId);
            window.location = "profile.html" + "?=" + person[key2].userId;
            history.onpopstate(person[key2].userId, "userId", person[key2].userId);
      }
      else{
        console.log("nah")
      }
    }

  }
}

function onFirebaseStateChanged() {
  firebase.auth().onAuthStateChanged(onStateChanged);
}








