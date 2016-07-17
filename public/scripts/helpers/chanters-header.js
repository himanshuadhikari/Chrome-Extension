Chanters("chanters-header", {
    goToPlayer: function() {
        // location.pathname = "/player";

        this.loadTemplate(function(error, userRequestedFile) {
            console.log(arguments);
        }.bind(this));
    },
    loadTemplate: function(cb) {
        var templateUrl = "http://localhost:4444/";

        var xmlhttp;
        if (templateUrl.length == 0) {
            // document.getElementById("txtHint").innerHTML = "";
            // return;
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
    }
});
