var firebaseConfig = {
    apiKey: "AIzaSyCiMhcUeubfLneR9yJayJvys0NHwkS2GLc",
    authDomain: "david-zzang-31328.firebaseapp.com",
    projectId: "david-zzang-31328",
    storageBucket: "david-zzang-31328.appspot.com",
    messagingSenderId: "182425833889",
    appId: "1:182425833889:web:71be5b5c2d7c1e6246fbe0",
    measurementId: "G-3P8T48LZJ6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();


$(document).ready(function ($) {

    firebase.auth().onAuthStateChanged(function (user) {

        onLoadData();
        if (user) {
            console.log(user)
            $("#profile").css("display", "block");
            $("#profile_img").attr("src", user.photoURL);
            $("#profile_info").css("display", "block");
            $("#profile_name").text(user.displayName);
            $("#login").css("display", "none");
            $("#logout").css("display", "block");

        }
        else {
            console.log('not login')
            $("#profile").css("display", "none");
            $("#profile_img").attr("src", "");
            $("#profile_info").css("display", "none");
            $("#profile_name").text("");
            $("#login").css("display", "block");
            $("#logout").css("display", "none");


        }
    });

});



// function login() {

// }

// function register() {

// }


// function onAddRecord() {
//     db.collection("bbs").add({
//         name: "Ada",
//         email: "Lovelace",
//         eventtime: new Date()
//     })
//         .then((docRef) => {
//             console.log("Document written with ID: ", docRef.id);
//         })
//         .catch((error) => {
//             console.error("Error adding document: ", error);
//         });
// }


function onAddRecord() {
    var _email = $("#exampleInputEmail1").val();
    var _name = $("#exampleInputName").val();
    var _date = new Date();




    db.collection("bbs").add({
        name: _name,
        email: _email,
        eventtime: _date
    })
        .then((docRef) => {

            var _str = "<tr>";
            _str += "<td>" + _email + "</td>";
            _str += "<td>" + _name + "</td>";
            _str += "<td>" + _date + "</td></tr>";
            $("#tblData").append(_str);


            $("#exampleInputEmail1").val("");
            $("#exampleInputName").val("");


            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

function getCurrentTime(val) {
    var t = "";
    var t1 = new Date(val);
    var yyyy = t1.getFullYear().toString();
    var mm = (t1.getMonth() + 1).toString();
    var dd = t1.getDate().toString();
    var hh = t1.getHours() < 10 ? "0" + t1.getHours() : t1.getHours();
    var min = t1.getMinutes() < 10 ? "0" + t1.getMinutes() : t1.getMinutes();
    var ss = t1.getSeconds() < 10 ? "0" + t1.getSeconds() : t1.getSeconds();
    t =
        yyyy +
        "/" +
        (mm[1] ? mm : "0" + mm[0]) +
        "/" +
        (dd[1] ? dd : "0" + dd[0]) +
        " " +
        hh +
        ":" +
        min +
        ":" +
        ss;
    return t;
}


var _allBbs = [];

function onLoadData() {
    $("#tblData").empty();
    db.collection("bbs")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var _t = {
                    id: doc.id,
                    value: doc.data()
                }
                _allBbs.push(_t);
                var _str = '<tr onclick="onSelectData(\'' + doc.id + '\')">';
                _str += "<td>" + doc.data().email + "</td>";
                _str += "<td>" + doc.data().name + "</td>";
                _str += "<td>" + getCurrentTime(
                    new Date(doc.data().eventtime.seconds * 1000)
                ) + "</td>";
                _str += "<td><img style='width:50px' src='" + doc.data().img + "'/></td></tr>";
                $("#tblData").append(_str);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}


function onSelectData(id) {
    console.log(id);

    var _item = _allBbs.find(item => item.id == id);


    console.log(_item)
    if (_item) {
        $("#btnUpdate").attr("data-rec-id", id);
        $("#btnDelete").attr("data-rec-id", id);
        $("#exampleInputFile").attr("data-rec-id", id);
        $("#exampleInputEmail1").val(_item.value.email);
        $("#exampleInputName").val(_item.value.name);
    }
    else {
        $("#btnUpdate").attr("data-rec-id", '');
        $("#btnDelete").attr("data-rec-id", '');
        $("#exampleInputFile").attr("data-rec-id", '');
    }
}

function onDeleteRecord() {
    var user = firebase.auth().currentUser;

    if (user) {
        var _id = $("#btnDelete").attr("data-rec-id");
        db.collection("bbs").doc(_id).delete().then(() => {

            $("#exampleInputEmail1").val('');
            $("#exampleInputName").val('');
            console.log("Document successfully deleted!");
            onLoadData();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

    }
    else {
        alert("Not Login")
    }

}

function onUpdateRecord() {
    var _email = $("#exampleInputEmail1").val();
    var _name = $("#exampleInputName").val();
    var _date = new Date();
    var db = firebase.firestore();

    var _id = $("#btnUpdate").attr("data-rec-id");

    var _img = $("#loadedimg").attr("data-uploaded-url");
    var mRef = db.collection('bbs').doc(_id);
    mRef
        .set({
            name: _name,
            email: _email,
            img: _img,
            eventtime: new Date(),

        }, { merge: true })
        .then(function () {
            onLoadData();
        });


}


function logout() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        //DO
    });
}

function googlelogIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/plus.login");
    provider.setCustomParameters({
        prompt: "select_account"
    });

    firebase.auth().signInWithRedirect(provider).then(function (result) {
        firebase.auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
            })
            .catch(function (error) {// Handle Errors here.
                var errorCode = error.code;
                // The email of the user's account used.
                var email = error.email;
            });
    });
}







function createFile(file) {
    if (!file.type.match("image.*")) {
        alert("이미지 화일을 선택해주세요.")
        return;
    } else {
        // var img = new Image();
        var reader = new FileReader();
        var vm = this;
        reader.onload = function (e) {
            // vm.image = e.target.result;
            vm.saveToFirebaseStorage(e, file);
        };
        reader.readAsDataURL(file);
    }
};

function handleChange(event) {
    createFile(event.target.files[0]);
}


function saveToFirebaseStorage(evt, items) {
    var user = firebase.auth().currentUser;
    if (user) {
        var _key = new Date().getTime();
        var storageRef = firebase.storage().ref();
        var _name = items.name.replace(
            /[~`!#$%\^&*+=\-\[\]\\';,/{}()|\\":<>\?]/g,
            ""
        );
        var uploadTask = storageRef
            .child("data/" + user.uid + "/" + _key + "/" + _name)
            .put(items);
        uploadTask.on(
            "state_changed",
            function (snapshot) {
                var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log("Upload is paused");
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log("Upload is running");
                        break;
                }
            },
            function (error) {
                console.log(error);
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    $("#loadedimg").attr('data-uploaded-url', downloadURL);
                    $("#loadedimg").find('img').attr('src', downloadURL);
                    $("#fileinput").css("display", 'none')
                    $("#loadedimg").css('display', 'block')
                });
            }
        );
    }
}

function onSendEmail()
{
    Email.send({
        Host : "smtp.gmail.com",
        Username : "david.inflearn@gmail.com",
        Password : "epdlqlemWkd",
        To : 'david.inflearn@gmail.com',
        From : "david.inflearn@gmail.com",
        Subject : "테스트 메일 입니다.",
        Body : '<p>안녕하세요</p>        <p>데이비드 입니다.</p>        <p>이건 이메일 <span style="color: rgb(184, 49, 47);"><u><strong>테스트</strong></u></span> 입니다.</p>'
    }).then(
      message => alert(message)
    );
}
