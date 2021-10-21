var auth = firebase.auth();
var docRef = firebase.firestore();
const saveButton = document.getElementById("saveButton");
const container = document.getElementById("container");
const textToSave = document.getElementById("postText").value;
var chatKey = "";
let currentDate = new Date();
let cDay = currentDate.getDate();
let cMonth = currentDate.getMonth() + 1;
let cYear = currentDate.getFullYear();
let time = currentDate.getHours() + ":" + currentDate.getMinutes();
var chatKey = "";
var friend_id = "";
var chatKey = "";
let latestDoc = null;

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		db = firebase.firestore();
		db.collection("userInfo")
			.doc(user.uid)
			.get()
			.then(function (doc) {
				if (doc.exists) {
					var downloadURL = doc.data().downloadURL;
					var fln = doc.data().fln;
					var username = doc.data().username;
					firebase
						.database()
						.ref("Posts")
						.on("value", function (lists) {
							lists.forEach(function (data) {
								var info = data.val();
								postKey = data.key;
								let likeArray = Object.values(info);
								var likes = likeArray.length;
								likeSetup = firebase
									.database()
									.ref("Posts/" + `${postKey}/` + "likes/");

								// const getNextPosts = async (doc) => {
								// 	usersRef = firebase
								// 		.database()
								// 		.ref("Posts")
								// 		.orderByKey()
								// 		.limitToLast(2);
								likeName = "fa-heart";
								const ratio = firebase
											.database()
											.ref("Posts/" + `${likeName.id}/` + "likes/");
								ratio.on("value", function (noti) {
										let likeArray = Object.values(noti.val());
										var likes = likeArray.length;
										getElementsByClassName(likeName).innerHTML="    0";
							})
									
									document.getElementById("list_div").innerHTML += `
									<div class="col-sm-6 offset-sm-3">
                                      <div class="post-block">
                                        <div class="d-flex justify-content-between">
                                          <div class="d-flex mb-3">
                                            <div class="mr-2">
                                              <a href="#!" class="text-dark"><img src="${info.profilePic}" alt="User" class="author-img"></a>
                                            </div>
                                            <div>
                                              <h5 class="mb-0"><span class="text-dark">${info.firstLast} @${info.username}</span ></h5>
                                              <p class="mb-0 text-muted">${info.time}</p>
                                            </div>
                                          </div>
                                          <div class="post-block__user-options">
                                            <a href="#!" id="triggerId" data-toggle="dropdown" aria-haspopup="true"
                                                aria-expanded="false">
                                                  <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-right" id="${info.uid}" aria-labelledby="triggerId">
                                              <a class="dropdown-item text-dark" href="#!"><i class="fa fa-pencil mr-1"></i>Edit</a>
                                              <a class="dropdown-item text-danger" href="#!"><i class="fa fa-trash mr-1"></i>Delete</a>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="post-block__content mb-2">
                                          <p class="px-3" id="${postKey}">${info.Post}</p>
                                          <!-- <img src="img/food1.jpg" alt="Content img"> -->
                                        </div>
                                        <div class="mb-3">
                                          <div class="d-flex justify-content-between mb-2">
                                            <div class="d-flex" >
                                              <h5 class="text-danger mr-2 likes"><span class="ratio" ><i class="fa fa-heart" id="${postKey}"></i></span></h5>
                                              <h5 class="text-danger mr-2"><span><i class="fa fa-comment" id="${postKey}" data-toggle="modal" data-target="#responseModal"></i></span></h5>
                                            </div>
                                            <!-- <a href="#!" class="text-dark"><span>Share</span></a> -->
                                          </div>
                                          
                                        </div>
                                      </div>
									</div>`;
								//});

								// 	window.addEventListener("DOMContentLoaded", () =>
								// 		getNextPosts()
								// 	);
								// 	const handleScroll = () => {
								// 		let triggerHeight =
								// 			container.scrollTop + container.offsetHeight;
								// 		if (triggerHeight >= container.scrollHeight) {
								// 			getNextPosts();
								// 		}
								// 	};
								// 	container.addEventListener("scroll", handleScroll);
								// };
								// getNextPosts();

								[...document.getElementsByClassName("rounded-circle")].forEach(
									function (card) {
										card.addEventListener("click", cardClicked);
										function cardClicked() {
											window.location = "profile.html" + "?=" + card.id;
											history.onpopstate(card.id, "userId", card.id);
										}
									}
								);
                
								[...document.getElementsByClassName("fa")].forEach(
									function (like) {
										const checkLikeList = firebase
											.database()
											.ref("Posts/" + `${like.id}/` + "likes/");
											like.style.color = "#fe2712";
										checkLikeList.on("value", function (noti) {
											let likeArray = Object.values(noti.val());
											var likes = likeArray.length;
											like.innerHTML = likes;
										});
										checkLikeList.on("child_added", function (snapshot) {
											var key = snapshot.val();
											if (key.userID == user.uid) {
												like.style.color = "black";
											} 
											else {
												card.removeEventListener("click",remove);
                        						like.style.color = "#fe2712";
											}
										});
										like.addEventListener("click", cardClicked);
										function cardClicked() {
											checkLikeList.on("child_added", function (snapshot) {
												var key = snapshot.val();
												//if(key.userID === user.uid){
												//alert("You've already liked this post")
												// } else{
												//   alert("ratio");
												firebase
													.database()
													.ref("Posts/" + `${card.id}/` + "likes/")
													.push({
														userID: doc.data().userId,
													});
												//}
											});
										}
									}
								);

								[...document.getElementsByClassName("fa-comment")].forEach(
									function (postCount) {
										firebase
											.database()
											.ref("Posts/" + `${postCount.id}/` + "replies/")
											.on("value", function (noti) {
												let likeArray = Object.values(noti.val());
												var comments = likeArray.length;
												postCount.innerHTML = " " + comments;
											});
									});

								[...document.getElementsByClassName("px-3")].forEach(function(post) {
									post.addEventListener("click", function () {
										window.location = "tweetview.html" + "?=" + post.id;
									});
								});
								
								[...document.getElementsByClassName("post-block__user-options")].forEach(function(editDelete){
									if(editDelete.id != user.uid){
										editDelete.style.visibility = 'hidden';
									}
								});

							});
						});

					saveButton.addEventListener("click", function () {
						firebase
							.database()
							.ref("Posts")
							.push({
								Post: textToSave,
								uid: user.uid,
								profilePic: downloadURL,
								firstLast: fln,
								username: username,
								time: time + " " + cMonth + "/" + cDay + "/" + cYear,
							})
							.then(function () {
								alert("Posted");
								//$.modal.close();
								$("#myModal").modal("hide");
							})
							.catch(function (error) {
								alert(error);
							});
					});
          function PopulateWFList(){
            const numberOfUsers = 28;
            const randomIndex = Math.floor(Math.random() * numberOfUsers);
            var ref = firebase.database().ref("users");
            ref.limitToLast(4).on("value", function (cOne) {
              cOne.forEach(function (snap) {
                user = snap.val();
                document.getElementById("card").innerHTML += `
                  <div class="profile">
        <img class="profile-pic" id="profile-pic" src=${user.photoURL}></img>
        <div class="profile-info">
        <span class="display-name">${user.name}</span>
        <span class="username">${user.username}</span>
        </div>
        </div>`;
              });
			});
		
          }
          PopulateWFList();

	// 				function PopulateFriendList() {
	// 					var friends = firebase.database().ref("friend_list");
	// 					friends.on("value", function (lists) {
	// 						lists.forEach(function (data) {
	// 							var lst = data.val();
	// 							var friendKey = "";
	// 							if (lst.friendId === user.uid) {
	// 								friendKey = lst.userId;
	// 							} else if (lst.userId === user.uid) {
	// 								friendKey = lst.friendId;
	// 							}
	// 							if (friendKey !== "") {
	// 								firebase
	// 									.database()
	// 									.ref("users")
	// 									.child(friendKey)
	// 									.on("value", function (data) {
	// 										var info = data.val();
	// 										document.getElementById("friends-card").innerHTML += `
    //                     <div class="profile">
    //       <img class="profile-pic" id="profile-pic" src=${info.photoURL}></img>
    //       <div class="profile-info">
    //           <span class="display-name">${info.name}</span>
    //           <span class="username">${info.username}</span>
    //       </div>
    //       <!-- <button class="follow-button followed" onclick="followUnfollow(this)">Unfollow</button> -->
    //   </div>`;
	// 									});
	// 							}
	// 						});
	// 					});
	// 				}
    //       PopulateFriendList();

				}
			});

	}
});

function logout() {
	firebase.auth().signOut();
}
