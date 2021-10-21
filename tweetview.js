const slug = window.location.href.split("?")[1].split("=")[1];
let currentDate = new Date();
let cDay = currentDate.getDate();
let cMonth = currentDate.getMonth() + 1;
let cYear = currentDate.getFullYear();
let currentTi = new Date();
let time = currentDate.getHours() + ":" + currentDate.getMinutes();
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
						.ref("Posts/" + `${slug}/`)
						.on("value", (snapshot) => {
							var info = snapshot.val();
							postKey = snapshot.key;
							let likeArray = Object.values(info);
							var likes = likeArray.length;
							likeSetup = firebase
								.database()
								.ref("Posts/" + `${postKey}/` + "likes/");
							commentSetup = firebase
								.database()
								.ref("Posts/" + `${slug}/` + "replies/");
							document.getElementById("list_div").innerHTML += `
    <div class="d-flex justify-content-center row">
<div class="col-md-8">
  <div class="feed p-2">
      <div class="bg-white border mt-2">
          <div>
              <div class="d-flex flex-row justify-content-between align-items-center p-2 border-bottom">
                  <div class="d-flex flex-row align-items-center feed-text px-2"><img class="rounded-circle" id="${info.uid}" src="${info.profilePic}" width="45px" height="45px">
                  <div class="d-flex flex-column flex-wrap ml-2"><span class="font-weight-bold" style="font-size:16">${info.firstLast}</span> @${info.username} </div>
                      <br>
                  </div>
                  <div class="feed-icon px-2"><i class="fa fa-ellipsis-v text-black-50"></i></div>
              </div>
          </div>
          <h6 id="left"> ${info.time}</h6>
          <hr>
          <h5 class="p-2 px-3"><span>${info.Post}</span></h5>
          <ul class="likeshare">
                    <li><h6 class="likes"></h6></li>
                    <li><h6 class="comments"></h6></li>
          </ul>
          <hr>

  </div>
  <div class="input-group mb-3">
<input type="text" class="form-control" placeholder="Reply to @${info.username}">
<div class="input-group-append">
  <button class="btn btn-primary" id="basic-addon2">Reply</button>
</div>

</div>
</div>
</div>
          
  `;
							[...document.getElementsByClassName("likes")].forEach(function (
								likeCount
							) {
								firebase
									.database()
									.ref("Posts/" + `${slug}/` + "likes/")
									.on("value", function (noti) {
										let likeArray = Object.values(noti.val());
										var likes = likeArray.length;
										likeCount.innerHTML = likes + " Likes";
									});
							});
							[...document.getElementsByClassName("comments")].forEach(
								function (commentCount) {
									firebase
										.database()
										.ref("Posts/" + `${slug}/` + "replies/")
										.on("value", function (noti) {
											let commentArray = Object.values(noti.val());
											var comments = commentArray.length;
											if (comments > 1) {
												commentCount.innerHTML = comments + " Comments";
											} else if (comments == 1) {
												commentCount.innerHTML = comments + " Comment";
											} else {
												commentCount.innerHTML = "0 Comments";
											}
										});
								}
							);

							firebase
								.database()
								.ref("Posts/" + `${slug}/` + "replies/")
								.on("child_added", function (snap) {
									//commentSetup.forEach(function() {
									var replies = snap.val();
									let commentArray = Object.values(snap.val());
									var comments = commentArray.length;
									if (comments >= 1) {
										document.getElementById("allReplies").innerHTML += `
                <div class="d-flex justify-content-center row">
                <div class="col-md-8">
                  <div class="feed p-2">
                      <div class="bg-white border mt-2">
                          <div>
                              <div class="d-flex flex-row justify-content-between align-items-center p-2 border-bottom">
                              <div class="d-flex flex-row align-items-center feed-text px-2"><img class="rounded-circle" id="${replies.uid}" src="${replies.profilePic}" width="45px" height="45px">
                              <div class="d-flex flex-column flex-wrap ml-2"><span class="font-weight-bold" style="font-size:16">${replies.firstLast}</span> @${replies.username} </div>
                                      <br>
                                  </div>
                                  <div class="feed-icon px-2"><i class="fa fa-ellipsis-v text-black-50"></i></div>
                              </div>
                          </div>
                          <h6 id="left"> ${replies.time}</h6>
                          <hr>
                          <h5 class="p-2 px-3"><span>${replies.Post}</span></h5>
                          <ul class="likeshare">
                                    <li><h6 class="likes"></h6></li>
                                    <li><h6 class="comments"></h6></li>
                          </ul>
                  </div>
                  <div class="input-group mb-3">
                </div>
                </div>
                </div>
                `;
									}

									//})
								});
							document
								.getElementById("replyButton")
								.addEventListener("click", function () {
									firebase
										.database()
										.ref("Posts/" + `${slug}/` + "replies/")
										.push({
											Post: document.getElementById("postReply").value,
											uid: user.uid,
											profilePic: downloadURL,
											firstLast: fln,
											username: username,
											time: time + " " + cMonth + "/" + cDay + "/" + cYear,
										})
										.then(function () {
											alert("Posted");
											$("#myModal").modal("hide");
										})
										.catch(function (error) {
											alert(error);
										});
								});
						});
				}
			});
	}
});
