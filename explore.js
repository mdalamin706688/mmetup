const container = document.getElementById("container");
const loading = document.querySelector(".loading");
let latestDoc = null;
var i = 0;
//latestDoc = data.docs[data.docs.length - 1];
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		firebase
			.firestore()
			.collection("userInfo")
			.get()
			.then((snap) => {
				size = snap.size; // will return the collection size

				const getNextProfiles = async (doc) => {
					var smallest;
					for (i = size; i >= 2; i--) {
						if (size % i === 0) {
							smallest = i;
						}
					}
					loading.classList.add("active");
					db = firebase.firestore();
					usersRef = db
						.collection("userInfo")
						.orderBy("fln")
						.startAfter(doc || 0);
					//.limit(5)
					const data = await usersRef.get();
					data.docs.forEach((doc) => {
						var downloadURL = doc.data().downloadURL;
						var fln = doc.data().fln;
						var userId = doc.data().userId;
						var program = doc.data().program;
						display(i, downloadURL, fln, program, userId);
						function display(row) {
							let new_html = "";
							new_html +=
								'<tr id="item" style="margin-right: 40px;margin-left: 40px;">';
							new_html += "<td>";
							new_html += "<td>";
							new_html += '<div class="grid-item">';
							new_html +=
								'<img class="pic" style="width:200px; height:200px;cursor:pointer;" src= "' +
								downloadURL +
								'">';
							new_html +=
								'<h2 class="fln" style="cursor:pointer;"> ' + fln + "";
							new_html += "</h2>";
							new_html += "<br>";
							new_html += '<h2 class="fln"> ' + program + "";
							new_html += "</h2>";
							new_html += "</div>";
							new_html += "</td>";
							new_html += "</td>";
							new_html += "</tr>";
							new_html += row;
							$("#grid-container").append(new_html);
							let eachName = document.querySelector(
								"#grid-container tr:last-child .fln"
							);
							let eachPic = document.querySelector(
								"#grid-container tr:last-child .pic"
							);
							eachName.addEventListener("click", userClicked);
							eachPic.addEventListener("click", userClicked);
							function userClicked() {
								window.location = "profile.html" + "?=" + userId;
								history.onpopstate(userId, "userId", userId);
							}
						}
						loading.classList.remove("active");
						latestDoc = data.docs[data.docs.length - 1];
						if (data.empty || latestDoc == 0) {
							loadMore.removeEventListener("click", handleClick);
							container.removeEventListener("scroll", handleScroll);
							alert("poop");
						}
					});
					window.addEventListener("DOMContentLoaded", () => getNextProfiles());
					const loadMore = document.querySelector(".load-more button");
					const handleClick = () => {
						getNextProfiles(latestDoc);
					};
					loadMore.addEventListener("click", handleClick);

					const handleScroll = () => {
						let triggerHeight = container.scrollTop + container.offsetHeight;
						if (triggerHeight >= container.scrollHeight) {
							getNextProfiles();
						}
					};
					container.addEventListener("scroll", handleScroll);
				};
				getNextProfiles();
			});
	}
});
