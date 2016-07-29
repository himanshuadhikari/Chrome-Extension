Chanters("chanters-header", {
    changeMode: function() {
        var view = document.querySelector("chanters-view")
        if (this.mode === "Day Mode") {
            view.classList.add('dark-div');
            this.mode = "Night Mode";
        } else if (this.mode === "Night Mode") {
            view.classList.remove('dark-div');
            this.mode = "Day Mode";
        }
    },
    mode: "Day Mode"
});
