/* Magic Mirror
 * Module: MMM-JEOPARDY
 *
 * By Mykle1
 *
 */
Module.register("MMM-JEOPARDY", {

    // Module config defaults.
    defaults: {
        rotateInterval: 5 * 60 * 1000, // New Jeopardy clue rotation.
        useHeader: false,              // true if you want a header
        header: "",
        maxWidth: "250px",
        animationSpeed: 3000,          // Object fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000, // 1 hour = 60 clues per call

    },

    getStyles: function() {
        return ["MMM-JEOPARDY.css"];
    },

  //  getScripts: function() {
  //      return ["moment.js"];
  //  },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
	//	this.date = moment(new Date()).format("YYYY-MM-DD");    
		this.url = "http://jservice.io/api/random?count=60";
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
        //    console.log(this.jeopardy); // For checking


            var top = document.createElement("div");
            top.classList.add("list-row");

			// Jeopardy Logo from local file
			var pic = document.createElement("div");
			var img = document.createElement("img");
			img.src = "modules/MMM-JEOPARDY/pix/logo300.jpg";		
			pic.appendChild(img);
			wrapper.appendChild(pic);

            // Category   
            var category = document.createElement("div");
            category.classList.add("small", "bright");
            category.innerHTML = "Category: &nbsp" + jeopardy.category.title;
            wrapper.appendChild(category);
			
			
			// Value of clue   
            var jeopardyValue = document.createElement("div");
            jeopardyValue.classList.add("xsmall", "bright");
			
			if (jeopardyValue.value !== null) {
                jeopardyValue.innerHTML = "For: &nbsp $" + jeopardy.value;
            } else
                jeopardyValue.innerHTML = "For: &nbsp" + "$200";
	            wrapper.appendChild(jeopardyValue);


            // The clue itself
            var jeopardyClue = document.createElement("div");
            jeopardyClue.classList.add("xsmall", "bright");
            jeopardyClue.innerHTML = "The clue is: &nbsp" + jeopardy.question + ".";
            wrapper.appendChild(jeopardyClue);


            // The answer in the form of a question
            var jeopardyAnswer = document.createElement("div");
            jeopardyAnswer.classList.add("small", "bright");
		//  cant get the delay in showing the answer to work
            jeopardyAnswer.innerHTML = "What is " + jeopardy.answer + "?";

        }
        wrapper.appendChild(jeopardyAnswer);
        return wrapper;
    },

    processJEOPARDY: function(data) {
    //    var date = moment(new Date()).format("YYYY-MM-DD");
        this.today = data.Today;
        this.jeopardy = data;
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