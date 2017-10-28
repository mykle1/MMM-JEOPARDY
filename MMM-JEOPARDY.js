/* Magic Mirror
 * Module: MMM-JEOPARDY
 *
 * By Mykle1
 *
 */
Module.register("MMM-JEOPARDY", {

    // Module config defaults.
    defaults: {
        rotateInterval: 30 * 1000,      // New Jeopardy clue rotation.
        useHeader: false,               // true if you want a header
        header: "THIS IS JEOPARDY!",    // Any text you want
        maxWidth: "250px",
        animationSpeed: 3000,           // Clue fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000, // 1 hour = 100 clues per call

    },

    getStyles: function() {
        return ["MMM-JEOPARDY.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
        this.url = "http://jservice.io/api/random?count=100";
        this.jeopardy = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "This is JEOPARDY!";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        var jeopardyKeys = Object.keys(this.jeopardy);
        if (jeopardyKeys.length > 0) {
            if (this.activeItem >= jeopardyKeys.length) {
                this.activeItem = 0;
            }
            var jeopardy = this.jeopardy[jeopardyKeys[this.activeItem]];


            var top = document.createElement("div");
            top.classList.add("list-row");

            var pic = document.createElement("div");
            var img = document.createElement("img");
			img.classList.add("img");
            img.src = "modules/MMM-JEOPARDY/pix/2.jpg";
            pic.appendChild(img);
            wrapper.appendChild(pic);

            var category = document.createElement("div");
			var str = jeopardy.category.title;
			var res = str.toUpperCase();
            category.classList.add("xsmall", "bright");
            category.innerHTML = "Category: &nbsp" + res;   // jeopardy.category.title;
            wrapper.appendChild(category);

            var jeopardyValue = document.createElement("div");
            jeopardyValue.classList.add("xsmall", "bright");
            jeopardyValue.innerHTML = (jeopardy.value != null) ? "For:   $" + jeopardy.value : "For: $200";
            wrapper.appendChild(jeopardyValue);

            var jeopardyClue = document.createElement("div");
            jeopardyClue.classList.add("xsmall", "bright");
            jeopardyClue.innerHTML = "The clue is: &nbsp" + jeopardy.question + ".";
            wrapper.appendChild(jeopardyClue);

            var jeopardyAnswer = document.createElement("div");
            jeopardyAnswer.classList.add("small", "bright");
            setTimeout(function() {
                jeopardyAnswer.innerHTML = "What is " + jeopardy.answer + "?"
            }, 20 * 1000);
            wrapper.appendChild(jeopardyAnswer);
        }
        return wrapper;
    },


    processJEOPARDY: function(data) {
        this.today = data.Today;
        this.jeopardy = data;
    //  console.log(this.jeopardy); checking my data
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getJEOPARDY();
        }, this.config.updateInterval);
        this.getJEOPARDY(this.config.initialLoadDelay);
        var self = this;
    },

    getJEOPARDY: function() {
        this.sendSocketNotification('GET_JEOPARDY', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "JEOPARDY_RESULT") {
            this.processJEOPARDY(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});