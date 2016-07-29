 Chanters("chanters-login", {
     domReady: function() {
         // if (localStorage && localStorage.chantersId)
         // this.remove();
         // else
         // localStorage.chantersId = Math.random();

         if (this.authanticate()) {
             this.remove();
             var _window = document.querySelector("chanters-view");
             _window.template = "player.html";
         }
     },
     goToPlayer: function() {
         if (this.userName && this.userName.trim() && this.email && this.email.trim()) {
             localStorage.userName = this.userName;
             localStorage.email = this.email;
             var _window = document.querySelector("chanters-view");
             _window.mode = "night";
             _window.template = "player.html";
         } else {
             this.classList.add("loginFalse");

             setTimeout(function() {
                 this.classList.remove("loginFalse");
             }.bind(this), 1000);
         }
     },
     loggedIn: false,
     display: 'block',
     userName: '',
     email: '',
     authanticate: function() {
         if (localStorage.userName && localStorage.email)
             return true;
         else
             return false;
     }
 });
