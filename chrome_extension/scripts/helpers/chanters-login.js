 Chanters("chanters-login", {
     domReady: function() {
         if (localStorage && localStorage.chantersId)
             console.log("localStorage.chantersId", localStorage.chantersId);
         else {
             localStorage.chantersId = Math.random();
         }

         window.onbeforeunload = function() {
             console.log("one");
         }
     },
     goToPlayer: function() {
         location.pathname = "/player";
     }
 });
