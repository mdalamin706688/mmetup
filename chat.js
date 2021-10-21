const messaging = firebase.messaging();

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})

// messaging.onBackgroundMessage((payload) => {
//     console.log('Received background message ', payload);
//     const notificationTitle = 'PrograMeet Notification';
//     const notificationOptions = {
//       body: 'Hello, you have recieved a new notification on PrograMeet.',
//       icon: '/logo.png'
//     };
  
//     self.registration.showNotification(notificationTitle,
//       notificationOptions);
//   });
var currentUserKey = "";
var chatKey = "";
var friend_id = "";
var sendTo = "";

// var today = new Date();
// var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
// var time = today.getHours() + ":" + today.getMinutes();
// var dateTime = date+' '+time;

function ChangeSendIcon(control) {
  if (control.value !== "") {
    document.getElementById("send").removeAttribute("style");
    document.getElementById("audio").setAttribute("style", "display:none");
  } else {
    document.getElementById("audio").removeAttribute("style");
    document.getElementById("send").setAttribute("style", "display:none");
  }
}

let chunks = [];
let recorder;
var timeout;

function record(control) {
  let device = navigator.mediaDevices.getUserMedia({ audio: true });
  device.then((stream) => {
    if (recorder === undefined) {
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);

        if (recorder.state === "inactive") {
          let blob = new Blob(chunks, { type: "audio/webm" });
          var reader = new FileReader();
          reader.addEventListener(
            "load",
            function () {
              var chatMessage = {
                userId: currentUserKey,
                msg: reader.result,
                msgType: "audio",
                dateTime: new Date().toLocaleString(),
              };
              firebase
                .database()
                .ref("chatMessages")
                .child(chatKey)
                .push(chatMessage, function (error) {
                  if (error) alert(error);
                  else {
                    document.getElementById("txtMessage").value = "";
                    document.getElementById("txtMessage").focus();
                  }
                });
            },
            false
          );
          reader.readAsDataURL(blob);
        }
      };
      recorder.start();
      control.setAttribute("class", "fas fa-stop fa-2x");
    }
  });
  if (recorder !== undefined) {
    if (control.getAttribute("class").indexOf("stop") !== -1) {
      recorder.stop();
      control.setAttribute("class", "fas fa-microphone fa-2x");
    } else {
      chunks = [];
      recorder.start();
      control.setAttribute("class", "fas fa-stop fa-2x");
    }
  }
}


function StartChat(friendKey, friendName, friendPhoto) {
  var friendList = {
    friendId: friendKey,
    userId: currentUserKey,
    friendURL: friendPhoto,
    name: friendName,
  };

  friend_id = friendKey;
  friendName = friendName;
  friendPhoto = friendPhoto;
  var db = firebase.database().ref("friend_list");
  var flag = false;
  db.on("value", function (friends) {
    friends.forEach(function (data) {
      var user = data.val();
      if (
        (user.friendId === friendList.friendId &&
          user.userId === friendList.userId) ||
        (user.friendId === friendList.userId &&
          user.userId === friendList.friendId)
      ) {
        flag = true;
        chatKey = data.key;
      }
    });
    if (flag === false) {
      chatKey = firebase
        .database()
        .ref("friend_list")
        .push(friendList, function (error) {
          if (error) alert(error);
          else {
            document.getElementById("chatPanel").removeAttribute("style");
            document
              .getElementById("divStart")
              .setAttribute("style", "display:none");
            hideChatList();
          }
        })
        .getKey();
    } else {
      document.getElementById("chatPanel").removeAttribute("style");
      document.getElementById("divStart").setAttribute("style", "display:none");
      hideChatList();
    }
    document.getElementById("divChatName").innerHTML = friendName;
    document.getElementById("imgChat").src = friendPhoto;
    document.getElementById("messages").innerHTML = "";
    document.getElementById("txtMessage").value = "";
    document.getElementById("txtMessage").focus();
    LoadChatMessages(chatKey, friendPhoto, friend_id);
    //SendMessage(friend_id);
      document.getElementById("txtMessage").onkeypress = function (key) {
      if (key.key === "Enter") {
        SendMessage(friend_id, friendName);
      }
    }
    
    var unfriend = document.getElementById('unfriend');
    unfriend.addEventListener('click', e => {
        firebase
        .database()
        .ref("friend_list/" + chatKey)
        .remove();
    })
    // function deleteNotif(key) {
    //   firebase
    //     .database()
    //     .ref("notifications/" + key)
    //     .remove();
    // }


  });

}

// trying to copy the function and wittle it down
// document.getElementById("txtMessage").addEventListener("keydown", function (key,friendKey, friendName,) {
//   var friendList = {
//     friendId: friendKey,
//     userId: currentUserKey,
//     name: friendName,
//   };
//   //added var to friendid to test export thing, may be an issue
//   friend_id = friendKey;
//   friendName = friendName;
//   var db = firebase.database().ref("friend_list");
//   var flag = false;
//   db.on("value", function (friends) {
//     friends.forEach(function (data) {
//       var user = data.val();
//       if (
//         (user.friendId === friendList.friendId &&
//           user.userId === friendList.userId) ||
//         (user.friendId === friendList.userId &&
//           user.userId === friendList.friendId)
//       ) {
//         flag = true;
//         chatKey = data.key;
//       }
//     });
    
//     document.getElementById("divChatName").innerHTML = friendName;
//   });
//   if (key.key === "Enter") {
      
//     SendMessage(friend_id, friendName);
//   }
// });


//says the variables are undefined when I try to console.log them but when I comment them out friend_id is the only one that works

      // var friendList = {
      //   friendId: friendKey,
      //   userId: currentUserKey,
      //   friendURL: friendPhoto,
      //   name: friendName,
      // };

      // friend_id = friendKey;
      // friendName = friendName;
      // friendPhoto = friendPhoto;
//says friendName is undefined and doesn't console log if its not commented out
      // SendMessage(friend_id, friendName);

      // console.log(friend_id);
      // console.log(friendName);

    // }
  // });




function LoadChatMessages(chatKey, friendPhoto) {
  var db = firebase.database().ref("chatMessages").child(chatKey);
  db.on("value", function (chats) {
    var messageDisplay = "";
    chats.forEach(function (data) {
      var chat = data.val();
      var dateTime = chat.dateTime.split(",");
      var msg = "";
      if (chat.msgType === "image") {
        msg = `<img src='${chat.msg}' class="img-fluid" />`;
      } else if (chat.msgType === "audio") {
        msg = `<audio controls>
                        <source src="${chat.msg}" type="video/webm" />
                    </audio>`;
      } else {
        msg = chat.msg;
      }
      if (chat.userId !== currentUserKey) {
        messageDisplay += `<div class="row">
                                    <div class="col-2 col-sm-1 col-md-1">
                                        <img src="${friendPhoto}" class="chat-pic rounded-circle"/>
                                    </div>
                                    <div class="col-6 col-sm-7 col-md-7">
                                        <p class="receive">
                                            ${msg}
                                            <span class="time float-right" title="${dateTime}">${dateTime}</span>
                                        </p>
                                    </div>
                                </div>`;
      } else {
        messageDisplay += `<div class="row justify-content-end">
                            <div class="col-6 col-sm-7 col-md-7">
                                <p class="sent float-right">
                                    ${msg}
                                    <span class="time float-right" title="${dateTime}">${dateTime}</span>
                                </p>
                            </div>
                            <div class="col-2 col-sm-1 col-md-1">
                            <!-- <img id="hi" class="chat-pic rounded-circle"/> -->
                            </div>
                        </div>`;
      }
    });
    document.getElementById("messages").innerHTML = messageDisplay;
    document
      .getElementById("messages")
      .scrollTo(0, document.getElementById("messages").scrollHeight);
  });
}
function showChatList() {
  document.getElementById("side-1").classList.remove("d-none", "d-md-block");
  document.getElementById("side-2").classList.add("d-none");
}
function hideChatList() {
  document.getElementById("side-1").classList.add("d-none", "d-md-block");
  document.getElementById("side-2").classList.remove("d-none");
}
function SendMessage(friend_id, friendName) {
  if (
    document.getElementById("txtMessage").value != "" &&
    document.getElementById("txtMessage").value != " "
  ) {
    var chatMessage = {
      userId: currentUserKey,
      msg: document.getElementById("txtMessage").value,
      msgType: "normal",
      dateTime: new Date().toLocaleString(),
    };
    let notification = {
      sendFrom: currentUserKey,
      sendTo: friend_id,
      photo: photoURL,
      friendName: friendName,
      dateTime: new Date().toLocaleString(),
      msg: document.getElementById("txtMessage").value,
      notifType: "text",
    };
    firebase.database().ref("notifications").push(notification);
    firebase
      .database()
      .ref("chatMessages")
      .child(chatKey)
      .push(chatMessage, function (error) {
        if (error) alert(error);
        else {
          firebase.database().ref('fcmTokens').child(friend_id).once('value').then(function (data) {
              $.ajax({
                  url: 'https://fcm.googleapis.com/fcm/send',
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'key=AAAAP_Sk5Ec:APA91bHVdh2Xy0uxfx4blOiJUE96M5T1feul9m2X3WkNhbkOIS983IjffYxVvYFkFJqlI8GUJOz8qgjJWisRcFNvwyqphcdZM_ygRXuAYhgaN8M92dQGZxEt0pa7kn0pLutI-SygMyWb'
                  },
                  data: JSON.stringify({
                      'to': data.val().token_id, 'data': { 'message': "You have recieved a new notification, please check your notifications" + '...', 'icon': '/logo.png' }
                  }),
                  success: function (response) {
                      console.log(response);
                  },
                  error: function (xhr, status, error) {
                      console.log(xhr.error);
                  }
              });
          });
          document.getElementById("txtMessage").value = "";
          document.getElementById("txtMessage").focus();
        }
      });
  } else {
    alert("You can't send an empty message");
  }
}

function ChooseImage() {
  document.getElementById("imageFile").click();
}
function SendImage(event) {
  var file = event.files[0];
  if (!file.type.match("image.*")) {
    alert("Please select image only.");
  } else {
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        var chatMessage = {
          userId: currentUserKey,
          msg: reader.result,
          msgType: "image",
          dateTime: new Date().toLocaleString(),
        };
        firebase
          .database()
          .ref("chatMessages")
          .child(chatKey)
          .push(chatMessage, function (error) {
            if (error) alert(error);
            else {
              document.getElementById("txtMessage").value = "";
              document.getElementById("txtMessage").focus();
            }
          });
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  }
}

function LoadChatList() {
  var db = firebase.database().ref("friend_list");
  db.on("value", function (lists) {
    lists.forEach(function (data) {
      var lst = data.val();
      var friendKey = "";
      if (lst.friendId === currentUserKey) {
        friendKey = lst.userId;
      } else if (lst.userId === currentUserKey) {
        friendKey = lst.friendId;
      }
      if(friendKey !== "") {
        firebase
          .database()
          .ref("users")
          .child(friendKey)
          .on("value", function (data) {
            var user = data.val();
            document.getElementById(
              "lstChat"
            ).innerHTML += 
            `<li class="list-group-item list-group-item-action" id="profile" onclick="StartChat('${data.key}', '${user.name}', '${user.photoURL}')">
                            <div class="row">
                                <div class="col-md-2">
                                    <img src="${user.photoURL}" class="friend-pic rounded-circle" />
                                </div>
                                <div class="col-md-10" style="cursor:pointer;">
                                    <p class="name" id="freindNameSearch">${user.name}</p>
                                    <div class="under-name"</div>
                                </div>
                                </div>
                            </div>
                        </li>`;
          });
      }
    });
  });
}
function searchChat(){
const search = document.getElementById('searchChat');
  search.onkeyup = function(){
  var friendList = firebase.database().ref("friend_list");
  var users = firebase.database().ref("users");
  var searchName = search.value;
  users.orderByChild('name').equalTo(searchName).on('child_added', function(snapshot){
    var user = snapshot.val()
    //if(user.name == searchName){
      let string = searchName; 
      let regex = new RegExp('('+string+')', 'gi');
      const found = regex.test(string);
      if(found == true){
      document.getElementById(
        "lstChat"
      ).innerHTML = null;

      document.getElementById(
              "lstChat"
            ).innerHTML += 
            `
            <ul class="list-group list-group-flush" id="lstChat">
              <li class="list-group-item" style="background-color: #f8f8f8">
  
              </li>
            </ul>
            <li class="list-group-item list-group-item-action" id="profile" onclick="StartChat('${snapshot.key}', '${user.name}', '${user.photoURL}')">            
            <div class="row">
                                <div class="col-md-2">
                                    <img src="${user.photoURL}" class="friend-pic rounded-circle" />
                                </div>
                                <div class="col-md-10" style="cursor:pointer;">
                                    <div class="name">${user.name}</div>
                                    <div class="under-name"></div>
                                </div>
                                </div>
                            </div>
                        </li>`;
    }
  })
  }
}

function NotificationCount() {
  let db = firebase.database().ref("notifications");
  db.orderByChild("sendTo")
    .equalTo(currentUserKey)
    .on("value", function (noti) {
      let notiArray = Object.values(noti.val());
      document.getElementById("notification").innerHTML = notiArray.length;
    });

  // let db = firebase.database().ref('notifications');
  // db.orderByChild('sendTo').equalTo(currentUserKey).on('value', function (noti) {
  //     let notiArray = Object.values(noti.val().filter(n => n.status === "Pending"));
  //     document.getElementById('notification').innerHTML = notiArray.length;
  // });
}

// function SendRequest(key) {
//                         var user = data.val();
//                         console.log(user)
//                             let notification = {
//                                 sendTo: key,
//                                 sendFrom: currentUserKey,
//                                 photo: photoURL,
//                                 dateTime: new Date().toLocaleString(),
//                                 status: 'Pending'
//                             };
//                             firebase.database().ref('notifications').push(notification, function (error) {
//                                 if (error) alert(error);
//                                 else {
//                                     PopulateUserList();
//                                 }
//                             });
//     }

function PopulateNotifications() {
  document.getElementById(
    "lstNotification"
  ).innerHTML = `<div class="text-center">
                                                         <span class="spinner-border text-primary mt-5" style="width:7rem;height:7rem"></span>
                                                     </div>`;
  var db = firebase.database().ref("notifications");
  var lst = "";
  db.orderByChild("sendTo")
    .equalTo(currentUserKey)
    .on("value", function (notis) {
      if (notis.hasChildren()) {
      }
      notis.forEach(function (data) {
        var noti = data.val();
        if (noti.status === "Pending") {
          lst += `<li class="list-group-item list-group-item-action">
                            <div class="row">
                                <div class="col-md-2">
                                    <img src="${noti.photo}" class="rounded-circle friend-pic" />
                                </div>
                                <div class="col-md-10" style="cursor:pointer;">
                                    <div class="name">${noti.name}
                                        <button onclick="Reject('${data.key}')" class="btn btn-sm btn-danger" style="float:right;margin-left:1%;"><i class="fas fa-user-times"></i> Reject</button>
                                        <button onclick="Accept('${data.key}')" class="btn btn-sm btn-success" style="float:right;"><i class="fas fa-user-check"></i> Accept</button>
                                    </div>
                                </div>
                            </div>
                        </li>`;
        }
        // if (noti.status === 'Pending' && noti.notifType === 'request') {
        //     lst += `<li class="list-group-item list-group-item-action">
        //                 <div class="row">
        //                     <div class="col-md-2">
        //                         <img src="${noti.photo}" class="rounded-circle friend-pic" />
        //                     </div>
        //                     <div class="col-md-10" style="cursor:pointer;">
        //                         <div class="name">${noti.name}
        //                             <button onclick="Reject('${data.key}')" class="btn btn-sm btn-danger" style="float:right;margin-left:1%;"><i class="fas fa-user-times"></i> Reject</button>
        //                             <button onclick="Accept('${data.key}')" class="btn btn-sm btn-success" style="float:right;"><i class="fas fa-user-check"></i> Accept</button>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </li>`;
        // }
        if (noti.status === "Accept") {
          lst += `<li class="list-group-item list-group-item-action">
                            <div class="row">
                                <div class="col-md-2">
                                    <img src="${noti.photo}" class="rounded-circle friend-pic"/>
                                </div>
                                <div class="col-md-10" style="cursor:pointer;">
                                    <h6>You and ${noti.name} are now friends</h6> 
                                    </div>
                                </div>
                            </div>
                        </li>`;
        }
        if (
          noti.msg != "" &&
          noti.userId != currentUserKey &&
          noti.notifType === "text"
        ) {
          lst += `<li class="list-group-item list-group-item-action">
                            <div class="row">
                                <div class="col-md-2">
                                    <img src="${noti.photo}" class="rounded-circle friend-pic" />
                                </div>
                                <div class="col-md-10" style="cursor:pointer;">
                                    <div class="name">${noti.friendName}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16" style="float:right;" onclick="deleteNotif('${data.key}')">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
                                        <h6>You have recieved a new message</h6>
                                        <h6>${noti.msg}</h6>
                                    </div>
                                </div>
                            </div>
                        </li>`;
        }
      });

      document.getElementById("lstNotification").innerHTML = lst;
    });
}
function deleteNotif(key) {
  firebase
    .database()
    .ref("notifications/" + key)
    .remove();
}

function Reject(key) {
  let db = firebase
    .database()
    .ref("notifications")
    .child(key)
    .once("value", function (noti) {
      let obj = noti.val();
      obj.status = "Reject";
      obj.notifType = "request";
      firebase
        .database()
        .ref("notifications")
        .child(key)
        .update(obj, function (error) {
          if (error) alert(error);
          else {
            // do something
            PopulateNotifications();
          }
        });
    });
}

function Accept(key) {
  let db = firebase
    .database()
    .ref("notifications")
    .child(key)
    .once("value", function (noti) {
      var obj = noti.val();
      obj.status = "Accept";
      obj.notifType = "request";
      firebase
        .database()
        .ref("notifications")
        .child(key)
        .update(obj, function (error) {
          if (error) alert(error);
          else {
            // do something
            PopulateNotifications();
            var friendList = {
              friendId: obj.sendFrom,
              userId: obj.sendTo,
              photo: obj.photo,
              notifType: obj.notifType,
            };
            firebase
              .database()
              .ref("friend_list")
              .push(friendList, function (error) {
                if (error) alert(error);
                else {
                  //do Something
                }
              });
          }
        });
    });
}
function PopulateFriendList() {
  var db = firebase.database().ref("friend_list");
  db.on("value", function (lists) {
    document.getElementById(
      "lstChat"
    ).innerHTML = `<li class="list-group-item" style="background-color:#f8f8f8;">
                            <input type="text" placeholder="Search for a friend" class="form-control form-rounded" id="form-control"/>
                        </li>`;
    lists.forEach(function (data) {
      var lst = data.val();
      var friendKey = "";
      if (lst.friendId === currentUserKey) {
        friendKey = lst.userId;
      } else if (lst.userId === currentUserKey) {
        friendKey = lst.friendId;
      }
      if (friendKey !== "") {
        firebase
          .database()
          .ref("users")
          .child(friendKey)
          .on("value", function (data) {
            var user = data.val();
            document.getElementById(
              "lstChat"
            ).innerHTML += `<li class="list-group-item list-group-item-action" onclick="StartChat('${data.key}', '${user.name}', '${user.photoURL}')">
                            <div class="row">
                                <div class="col-md-2">
                                    <img src="${user.photoURL}" class="friend-pic rounded-circle" />
                                </div>
                                <div class="col-md-10" style="cursor:pointer;">
                                    <div class="name">${user.name}</div>
                                    <div class="under-name">This is some message</div>
                                </div>
                                </div>
                            </div>
                        </li>`;
          });
      }
    });
  });
}
function unfriend(){

}

function onFirebaseStateChanged() {
  firebase.auth().onAuthStateChanged(onStateChanged);
}

function onStateChanged(user) {
  if (user) {
    var userProfile = { email: "", name: "", photoURL: "" };
    userProfile.email = firebase.auth().currentUser.email;
    userProfile.name = firebase.auth().currentUser.displayName;
    userProfile.photoURL = firebase.auth().currentUser.photoURL;
    var db = firebase.database().ref("users");
    var flag = false;
    db.on("value", function (users) {
      users.forEach(function (data) {
        var user = data.val();
        if (user.email === userProfile.email) {
          currentUserKey = data.key;
          photoURL = user.photoURL;
          flag = true;
          
        }
      });

      if (flag === false) {
        firebase.database().ref("users").push(userProfile, callback);
      } else {
        me = firebase.firestore();
        me.collection("userInfo")
          .doc(user.uid)
          .get()
          .then(function (doc) {
            if (doc.exists) {
              var downloadURL = doc.data().downloadURL;
              document.getElementById("imgProfile").src = downloadURL;
            }
          });

      }

      LoadChatList();
      NotificationCount();
    });
  } else {
    document.getElementById("imgProfile").src = "images/pp.png";
    document.getElementById("imgProfile").title = "";
    document.getElementById("lnkNewChat").classList.add("disabled");
  }
}
function callback(error) {
  if (error) {
    alert(error);
  } else {
    // document.getElementById('imgProfile').src = ;
    // document.getElementById('imgProfile').title = firebase.auth().currentUser.displayName;
  }
}
onFirebaseStateChanged();