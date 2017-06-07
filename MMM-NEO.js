/* Magic Mirror
 * Module: MMM-NEO
 *
 * By Mykle1
 *
 */
Module.register("MMM-NEO", {

    // Module config defaults.
    defaults: {
        rotateInterval: 5 * 60 * 1000, // New Object rotation.
        useHeader: false,              // true if you want a header
        header: "",
        maxWidth: "250px",
        animationSpeed: 3000,          // Object fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000, // NEO limitation = 50 calls per day. Do NOT change!

    },

    getStyles: function() {
        return ["MMM-NEO.css"];
    },

    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
		this.date = moment(new Date()).format("YYYY-MM-DD");
        this.url = "https://api.nasa.gov/neo/rest/v1/feed?start_date="+this.date+"&detailed=true&api_key=DEMO_KEY";
	//	this.url = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + this.date + "&detailed=true&api_key=h8B6cBf4uMSUnArnD7efNm7NyhdHGCnlhvAIM4pf";
		this.neo = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "This is gonna be close...";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        var neoKeys = Object.keys(this.neo);
        if (neoKeys.length > 0) {
            if (this.activeItem >= neoKeys.length) {
                this.activeItem = 0;
            }
            var neo = this.neo[neoKeys[this.activeItem]];
            // console.log(this.neo);  For checking


            var top = document.createElement("div");
            top.classList.add("list-row");

            // Name of Near Earth Object   
            var name = document.createElement("div");
            name.classList.add("small", "bright");
            name.innerHTML = "NASA NEO ID: &nbsp" + neo.name;
            wrapper.appendChild(name);


            // Miss Distance. Math.round = Brofessor!
            var neoMiss = document.createElement("div");
            neoMiss.classList.add("xsmall", "bright");
            neoMiss.innerHTML = "Missed Earth by &nbsp" + Math.round(neo.close_approach_data[0].miss_distance.kilometers) + '&nbsp' + "kilometers";
            wrapper.appendChild(neoMiss);


            // Close Approach Date
            var neoApproach = document.createElement("div");
            neoApproach.classList.add("xsmall", "bright");
            neoApproach.innerHTML = "Close Approach Date: &nbsp" + neo.close_approach_data[0].close_approach_date;
            wrapper.appendChild(neoApproach);


            // Estimated Diameter
            var neoDiameter = document.createElement("div");
            neoDiameter.classList.add("xsmall", "bright");
            neoDiameter.innerHTML = "Estimated Diameter: " + Math.round(neo.estimated_diameter.meters.estimated_diameter_max) + '&nbsp' + "meters";
            wrapper.appendChild(neoDiameter);


            // relative_velocity km/hour
            var neoVelocity = document.createElement("div");
            neoVelocity.classList.add("xsmall", "bright");
            neoVelocity.innerHTML = "Velocity per hour: &nbsp" + Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_hour) + '&nbsp' + "km/h";
            wrapper.appendChild(neoVelocity);


            // relative_velocity km/second
            var neoVelocity2 = document.createElement("div");
            neoVelocity2.classList.add("xsmall", "bright");
            neoVelocity2.innerHTML = "Velocity per second: &nbsp" + Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_second) + '&nbsp' + "km/s";
            wrapper.appendChild(neoVelocity2);


            // Potentially Hazardous. Met Brofessor's if/else challenge. Stupid this!
            var neoDanger = document.createElement("div");
            neoDanger.classList.add("xsmall", "bright");
			if (neo.is_potentially_hazardous_asteroid === true) {
                neoDanger.innerHTML = "Potentially Hazardous: &nbsp" + "Yes";
            } else
                neoDanger.innerHTML = "Potentially Hazardous: &nbsp" + "No";
        }
        wrapper.appendChild(neoDanger);
        return wrapper;
    },

    processNEO: function(data) {
        var date = moment(new Date()).format("YYYY-MM-DD");
        this.today = data.Today;
        this.neo = data[date];
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Near Earth Objects");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getNEO();
        }, this.config.updateInterval);
        this.getNEO(this.config.initialLoadDelay);
        var self = this;
    },

    getNEO: function() {
        this.sendSocketNotification('GET_NEO', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "NEO_RESULT") {
            this.processNEO(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});