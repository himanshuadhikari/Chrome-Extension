 Chanters("chanters-view", {
     domReady: function() {
         if (location.pathname === "/index.html") {
             this.mode = "night";
             setTimeout(function() {
                 this.mode = "day";
             }.bind(this), 200);
         }
         this.template = "login.html";

         window.onbeforeunload = function() {
             delete localStorage.isPlaying;
             delete localStorage.songName;
         }
     },
     loadTemplate: function(cb, localPage) {
         var apiURL = "http://localhost:4444/static/views/";

         var chromeAppUrl = "/views/";
         var templateUrl = chromeAppUrl + this.template;

         var xmlhttp;
         if (templateUrl.length == 0) {
             return;
         }
         if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
             xmlhttp = new XMLHttpRequest();
         } else { // code for IE6, IE5
             xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
         }
         xmlhttp.onreadystatechange = function() {
             if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                 cb(null, xmlhttp.responseText)
             }
         }
         xmlhttp.open("GET", templateUrl, true);
         xmlhttp.send();
     },
     insertToDom: function(html) {
         var domParser = document.createElement("div");
         domParser.innerHTML = html;

         var userTag = domParser.children[0];

         var tagToInsert = document.createElement(userTag.tagName);
         tagToInsert.appendChild(userTag.querySelector("template"));

         var script = document.createElement("script");
         script.src = userTag.querySelector("script").src;

         tagToInsert.appendChild(script);
         this.innerHTML = "";
         this.appendChild(tagToInsert);
     },
     template_: function() {
         this.loadTemplate(function(error, userRequestedFile) {
             this.insertToDom(userRequestedFile);
         }.bind(this));
     },
     mode: "",
     mode_: function() {
         if (this.mode === "day")
             this.classList.remove("dark-div");
         if (this.mode === "night")
             this.classList.add("dark-div");
     }
 });
