Chanters("chanters-player", {
    domReady: function() {
        window.requestAnimationFrame(welcomeAnimation);
        this.style.display = "block";
    },
    left: "46%",
    top: "300px",
    visibility: "hidden",
    videoMode: "hidden",
    createList: function createList(event) {
        event.target.nextElementSibling.click();
        document.querySelector("#mode").classList.remove("hidden");
        event.target.nextElementSibling.onchange = function() {
            this.visibility = "hidden";
            var list_ = event.target.nextElementSibling.files,
                str = "",
                songList = document.querySelector("#songList"),
                chantersPlayer = document.querySelector("chanters-player");
            document.querySelector("#songList ").style.display = "block";
            document.querySelector("chanters-view").classList.remove("dark-div");

            for (var i = 0; i < list_.length; i++) {
                var li = document.createElement('li');
                (function(li, i) {
                    if (list_[i].name.indexOf(".jpg") === -1 && list_[i].name.indexOf(".jpeg") === -1) {
                        li.innerHTML = '<a> ' + list_[i].name + ' </a>';
                        li.songObject = list_[i];
                        li.onclick = playMe;
                        songList.appendChild(li);
                        setTimeout(function() {
                            li.style.opacity = 1;
                            if (chantersPlayer.clientHeight < chantersPlayer.parentNode.clientHeight) {
                                if (!chantersPlayer.style.height)
                                    chantersPlayer.style.height = chantersPlayer.clientHeight + 4 + "px";
                                else {
                                    chantersPlayer.style.height = parseInt(chantersPlayer.style.height.split("px")[0]) + 4 + "px";
                                }
                            }
                        }, 2000);
                    }
                })(li, i);
                // getImageFromMp3(list_[i]);
                // }
            }
            welcome.remove();
            document.querySelector("#fileupload").remove();
            document.querySelector("#_fileupload").remove();
            document.querySelector("#title").style.display = "block";
        }.bind(this);
    }
});
var welcome = document.querySelector("#welcome");
var str = "welcome to chanters";
var count = 0;
var notification;

function notifyMe(songName) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        if (notification)
            notification.close();
        notification = new Notification("Chanters : Now playing", {
            "body": songName,
            "icon": "images/vidyut-jamwal-7a.jpg",
            renotify: true
        })
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification("Hi there!");
                var notification = new Notification("Chanters : Hi there!", {
                    "body": "Welcome to Chanters",
                    renotify: true
                })
            }
        });
    }

    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}

if (localStorage.isPlaying == "true") {
    str = "Now playing " + localStorage.songName;
}

function welcomeAnimation() {
    if (str[count]) {
        welcome.innerHTML += str[count];
        count++;
        window.requestAnimationFrame(welcomeAnimation);
    } else {
        setTimeout(function() {
            if (localStorage.isPlaying == "true") {
                str = "Now playing " + localStorage.songName;
            } else {
                var userName = localStorage.userName;
                var chantersPlayer = document.querySelector("chanters-player");
                welcome.innerHTML = "Hello " + userName + ", Please choose songs to play";
                document.querySelector("#fileupload").style.display = "block";
                window.cancelAnimationFrame(welcomeAnimation);
                chantersPlayer.visibility = "visible";
            }
        }, 2000)
    }
}




function getImageFromMp3(file) {
    id3(file, function(err, tags) {
        var li = document.createElement('li');

        if (tags && tags.v2 && tags.v2.image) {
            var arrayBufferView = new Uint8Array(tags.v2.image.data);
            tags.v2.image.mime = tags.v2.image.mime || 'image/jpeg';
            var blob = new Blob([arrayBufferView], {
                type: tags.v2.image.mime
            });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);

            li.innerHTML = '<image src="' + imageUrl + '"/><a onclick="playMe(event)"> ' + file.name + ' </a>';
        } else {
            li.innerHTML = '<a onclick="playMe(event)"> ' + file.name + ' </a>';
        }
        li.songObject = file;
        document.querySelector("#songList").appendChild(li);
    });
}

var audio = new Audio();
var video = document.querySelector("video");
context = new AudioContext();
analyser = context.createAnalyser();
source = context.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(context.destination);
var canvas = document.getElementById('analyser');
audio.volume = .7;
var previous;
var seek = document.querySelector("#seek");

function playMe(event, nextSong) {
    if (event.target.nodeName === "A" || (nextSong && nextSong.nodeName === "LI")) {


        applyCurrentSong(event.target.parentNode, previous);
        previous = nextSong || event.target.parentNode;
        var file = previous.songObject;

        var _URL = window.URL || window.webkitURL;

        // notifyMe(file.name);

        var chantersPlayer = document.querySelector("chanters-player");
        if (file.name.indexOf(".mp4") !== -1) {
            if (audio)
                audio.pause();
            video.src = _URL.createObjectURL(file);
            chantersPlayer.videoMode = "visible";
            video.load();
            video.play();
            window.cancelAnimationFrame(frameLooper);
            animationFlag = false;
        } else {
            audio.src = _URL.createObjectURL(file);
            if (video) {
                video.pause();
                video.style.display = "none";
                chantersPlayer.videoMode = "hidden";
            }
            audio.load();
            audio.play();
            visualizer();
            seek.max = audio.duration;
            if (!nextSong)
                event.target.parentNode.appendChild(canvas);
        }


        localStorage.isPlaying = true;
        localStorage.songName = file.name;
        seek.style.display = "block";
        document.querySelector("#totalTime").style.display = "block";
        document.querySelector("#currentTime").style.display = "block";
    }
}

function applyCurrentSong(currentSong, previousSong) {
    if (previousSong) {
        previousSong.classList.remove("border-right-red");
        previousSong.style.backgroundColor = "transparent"
    }

    currentSong.classList.add("border-right-red");
    currentSong.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
}

audio.oncanplaythrough = function() {
    var min = Math.floor(audio.duration / 60);
    var sec = Math.floor(audio.duration % 60);
    if (sec < 10) {
        sec = '0' + sec;
    }
    if (min < 60) {
        min = '0' + min;
    }

    document.querySelector("#totalTime").innerText = min + " : " + sec;
}

audio.onended = function() {
    var nextSong = previous.nextElementSibling;
    playMe(undefined, nextSong);
}

var visualizer = function() {
    canvas.style.display = "block";
    ctx = canvas.getContext('2d');
    analyser.connect(context.destination);
    animationFlag = true;
    frameLooper();
    bufferLength = analyser.frequencyBinCount;
}

function frameLooper() {
    if (animationFlag) {
        window.requestAnimationFrame(frameLooper);
        fbc_array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fbc_array);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
        // light blue
        grd.addColorStop(0, '#E20604');
        // dark blue
        grd.addColorStop(.20, '#FDF629');
        grd.addColorStop(.40, '#4AF14E');
        grd.addColorStop(.60, '#08D8EC');
        grd.addColorStop(.80, '#3231F0');
        grd.addColorStop(1, '#9426A3');
        ctx.fillStyle = grd;
        bars = 100;
        for (var i = 0; i < bars; i++) {
            bar_x = i * 3;
            bar_width = 2;
            bar_height = -(fbc_array[i] / 3);
            // experiment.style.transform = "scale(" + -bar_height / 10 + ")";
            ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
        }
    }
}

audio.ontimeupdate = function() {
    var curtime = parseInt(audio.currentTime, 10);
    var min = Math.floor(curtime / 60);
    var sec = curtime % 60;
    if (sec < 10) {
        sec = '0' + sec;
    }
    if (min < 60) {
        min = '0' + min;
    }

    if (seek.max === "NaN") {
        seek.max = audio.duration;
    }

    seek.value = Math.floor(audio.currentTime);
    document.querySelector("#currentTime").innerText = min + " : " + sec;
}
seek.oninput = function() {
    audio.currentTime = seek.value;
}

var seekEvent = function(what) {
    if (what === 'up') {
        audio.currentTime += 5;
    } else if (what === 'down') {
        audio.currentTime -= 5;
    }
}

var animationFlag = false;
var keyEvent = function(event) {
    if (event.keyCode === 38)
        volumeEvent('up');

    else if (event.keyCode === 40)
        volumeEvent('down');

    else if (event.keyCode === 39)
        seekEvent('up');

    else if (event.keyCode === 37)
        seekEvent('down');

    else if (event.keyCode === 77)
        volumeEvent("mute");

    else if (event.keyCode === 80)
        if (audio.paused === false) {
            audio.pause();
            window.cancelAnimationFrame(frameLooper);
            animationFlag = false;
        } else {
            audio.play();
            animationFlag = true;
            frameLooper();
        }

    if (previous) {
        if (event.keyCode === 190)
            playMe(undefined, previous.nextElementSibling);

        if (event.keyCode === 188)
            playMe(undefined, previous.previousElementSibling);
    }
}

var volumeEvent = function(what) {
    if (what === 'up' && audio.volume < .9) {
        audio.volume += .1;
    } else if (what === 'down' && audio.volume > .1) {
        audio.volume -= .1;
    } else if (what === "mute") {
        if (audio.muted) {
            audio.muted = false;
            animationFlag = true;
            frameLooper();
        } else {
            audio.muted = true;
            window.cancelAnimationFrame(frameLooper);
            animationFlag = false;
        }
    }
}

document.addEventListener("keydown", keyEvent);
document.querySelector("#songList").addEventListener("wheel", scrollList);

var lastScrollTop = 0;

function scrollList(event) {
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
        delta = event.wheelDelta / 60;
    } else if (event.detail) {
        delta = -event.detail / 2;
    }
    var currPos = this.scrollTop;
    currPos = parseInt(currPos) - (delta * 10);
    this.scrollTop = currPos;
};

// var reader = new FileReader();
// reader.onload = function(e) {
//     var dv = new jDataView(this.result);

//     if (dv.getString(3, dv._view.byteLength - 128) == 'TAG') {
//         var title = dv.getString(30, dv.tell());
//         var artist = dv.getString(30, dv.tell());
//         var album = dv.getString(30, dv.tell());
//         var year = dv.getString(4, dv.tell());
//     } else {
//         // no ID3v1 data found.
//     }
//     debugger;
// }
// reader.readAsArrayBuffer(file);
