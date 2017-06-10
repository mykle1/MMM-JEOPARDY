## MMM-JEOPARDY
Spanning more than 40 years, the widely popular game show comes to your Magic Mirror.
With more than **156,800** clues and answers from the show.

## How it works

Just like the show, you are presented with a category and a value for the clue in that category.
The clue is given. You have a specified amount of time to respond before the answer appears. 
Then it's on to the next category and clue. 
Fast pace. Challenging. Educational. Fun!

## Examples

* Annotated .css file included for aligning and coloring text and header.

![](pix/1.JPG), ![](pix/2.JPG), ![](pix/3.JPG)

## Installation

* `git clone https://github.com/mykle1/MMM-JEOPARDY` into the `~/MagicMirror/modules` directory.

* No API needed!


## Config.js entry and options

    {
        module: 'MMM-JEOPARDY',
        position: 'top_left',               // Works well anywhere
        config: { 
		rotateInterval: 1 * 60 * 1000, // New clue Rotation.
		useHeader: false,              // true if you want a header
		header: "",
		maxWidth: "250px",             // Stretch or constrain according to region
		animationSpeed: 3000,          // New clue fades in and out
		initialLoadDelay: 4250,
		retryDelay: 2500,
		updateInterval: 60 * 60 * 1000, // 1 call per hour gets 100 new clues
        }
    },
	

## Special thanks to SpaceCowboysDude
