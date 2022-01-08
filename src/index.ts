import * as PIXI from 'pixi.js';

const app = new PIXI.Application();
document.body.appendChild(app.view);

window.addEventListener('load',()=>{
	app.view.width = window.innerWidth;
	app.view.height = window.innerHeight;	

})
window.addEventListener('resize',()=>{
	app.view.width = window.innerWidth;
	app.view.height = window.innerHeight;	
})
declare global{
	interface Window { WebFontConfig:any}

}
// // Load them google fonts before starting...!
window.WebFontConfig = {
    google: {
        families: ['Snippet', 'Arvo:700italic', 'Podkova:700'],
    },

    active() {
        init();
    },
};

/* eslint-disable */
// include the web-font loader script
(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'
    }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = true;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode?.insertBefore(wf, s);
}());
/* eslint-enabled */

function init() {
    // create some white text using the Snippet webfont
    const form = document.getElementById('slidecontainer');
    const labelAngle = document.createElement('div');
    labelAngle.textContent = "Angle";
    const SkewAngle = document.createElement('div');
    SkewAngle.textContent = "Skew";
    const Angle = document.createElement("input");
    Angle.type = 'range';
    Angle.max = '360';
    Angle.min = '0';
    Angle.style.display = 'block';
    form?.appendChild(Angle);
const Skew = document.createElement("input");
    Skew.type = 'range';
    Skew.max = '85';
    Skew.min = '-85';
    Skew.style.display = 'block';
    form?.appendChild(labelAngle);
    form?.appendChild(Angle);
    form?.appendChild(SkewAngle);
    form?.appendChild(Skew);
    const textBox = document.createElement("input");
    textBox.type = 'text';
    textBox.style.display = 'block';
    form?.appendChild(textBox)
    const textSample = new PIXI.Text('Text to show', {
	    fontFamily: 'Snippet',
	    fontSize: 50,
	    fill: 'white',
	    align: 'left',
	});
    let x=0;
    let y= 0;
	textSample.position.set(x,y);
	textSample.anchor.set(0.5,0.5);
	textSample.text ='123';
	app.stage.addChild(textSample);
	Angle.addEventListener('input',(e)=>{
		const element = e.target as HTMLInputElement;
		textSample.angle = 30;
    
	})
	Skew.addEventListener('input',(e)=>{
		const element = e.target as HTMLInputElement;
		textSample.skew.set(parseInt(element.value)*PIXI.DEG_TO_RAD,0);
    
	})
	textBox.addEventListener('input',(e)=>{
		const element = e.target as HTMLInputElement;
		textSample.text = element.value;
	})
	window.addEventListener('resize',(e)=>{
		textSample.position.set(window.innerWidth/2,window.innerHeight/2);
	})
}

