import * as PIXI from "pixi.js";
import { Application, Sprite } from "pixi.js";

const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  backgroundAlpha:1,
  resizeTo: window,
});
document.body.appendChild(app.view);
declare global {
  interface Window {
    WebFontConfig: any;
  }
}
// // Load them google fonts before starting...!
window.WebFontConfig = {
  google: {
    families: ["Snippet", "Arvo:700italic", "Podkova:700"],
  },

  active() {
    init();
  },
};
(function () {
  const wf = document.createElement("script");
  wf.src = `${
    document.location.protocol === "https:" ? "https" : "http"
  }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
  wf.type = "text/javascript";
  wf.async = true;
  const s = document.getElementsByTagName("script")[0];
  s.parentNode?.insertBefore(wf, s);
})();
/* eslint-enabled */

function init() {

    AppData.sprite = new PIXI.Sprite();
    AppData.sprite.anchor.set(0.5);
    app.stage.addChild(AppData.sprite);
    AppData.text = new PIXI.Text('asd',{
        fontFamily: 'Snippet',
        fontSize: AppData.defaultFontSize,
        fill: TextOptionUI.color.value,
        align: 'left',
    }); 
    AppData.text?.position.set(window.innerWidth/2, window.innerHeight/2);
    AppData.text?.anchor.set(0.5,0.5);
    app.stage.addChild(AppData.text);
    AppData.text.text = TextOptionUI.Text.value;

    window.addEventListener('resize',()=>{
        AppData.text?.position.set(window.innerWidth/2, window.innerHeight/2);
    });

    TextOptionUI.Rotation.addEventListener('input',()=>{
        if(AppData.text) AppData.text.angle = parseInt(TextOptionUI.Rotation.value);
    });
    TextOptionUI.Skew.addEventListener('input',()=>{
        if(AppData.text) AppData.text.skew.set(parseFloat(TextOptionUI.Skew.value)*PIXI.DEG_TO_RAD,0);
    });
    TextOptionUI.Scale.addEventListener('input',()=>{
        if(AppData.text) AppData.text.style.fontSize = parseFloat(TextOptionUI.Scale.value)*AppData.defaultFontSize;
    });
    TextOptionUI.Text.addEventListener("input",()=>{
        if(AppData.text) AppData.text.text = TextOptionUI.Text.value;
    });
    TextOptionUI.color.addEventListener("input",()=>{
        if(AppData.text) AppData.text.style.fill = TextOptionUI.color.value;
    });
    BackgroundOptionUI.Input.addEventListener('input',()=>{
        LoadURL(BackgroundOptionUI.Input.files as FileList).then((data)=>{
            const img = document.createElement('img');
            img.src = data+'';
            if(AppData.sprite) AppData.sprite.texture = PIXI.Texture.from(img);
        })
    });
    BackgroundOptionUI.Scale.addEventListener('input',()=>{
        if(AppData.sprite) AppData.sprite.scale.set(parseFloat(BackgroundOptionUI.Scale.value));
    });
    BackgroundOptionUI.Position.X.addEventListener('input',()=>{
        if(AppData.sprite) AppData.sprite.position.set(parseInt(BackgroundOptionUI.Position.X.value),AppData.sprite.position._y);
    });
    
    BackgroundOptionUI.Position.Y.addEventListener('input',()=>{
        if(AppData.sprite) AppData.sprite.position.set(AppData.sprite.position._x,parseInt(BackgroundOptionUI.Position.Y.value));
    });
}

function LoadURL(file: FileList){
    
    return new Promise<ArrayBuffer>((resolve,reject)=>{
        const target = file[0];
        const reader = new FileReader();
        reader.addEventListener('load',(event)=>{
            resolve(event.target?.result as ArrayBuffer);
        })
        reader.addEventListener('error',()=>{
            reject();
        })
        reader.readAsDataURL(target);
    });
}


const AppData:{text?:PIXI.Text,sprite?:PIXI.Sprite,defaultFontSize:number} = {
    defaultFontSize:50
};
const TextOptionUI = {
    Skew:document.getElementById("skew") as HTMLInputElement,
    Rotation: document.getElementById('rot') as HTMLInputElement,
    Scale: document.getElementById('TScale') as HTMLInputElement,
    Text: document.getElementById('text') as HTMLInputElement,
    color: document.getElementById('color') as HTMLInputElement,
};

const BackgroundOptionUI = {
    Scale: document.getElementById('scale') as HTMLInputElement,
    Input: document.getElementById('fileInput') as HTMLInputElement,
    Position:{
        X: document.getElementById('positionX') as HTMLInputElement,
        Y: document.getElementById('positionY') as HTMLInputElement,
    },
}

const color =  document.getElementById('bcolor') as HTMLInputElement;
app.renderer.backgroundColor = parseInt(color.value.substring(1),16);
color.addEventListener('input',()=>{
    app.renderer.backgroundColor = parseInt(color.value.substring(1),16);
})
window.addEventListener('keydown',(e)=>{
        let multiplier = 1;
        if(e.shiftKey) multiplier = 10
        
        if(e.code ==='ArrowRight')
        BackgroundOptionUI.Position.X.value = (parseInt(BackgroundOptionUI.Position.X.value)+multiplier).toString();
        if(e.code ==='ArrowLeft')
        BackgroundOptionUI.Position.X.value = (parseInt(BackgroundOptionUI.Position.X.value)-multiplier).toString();
        if(e.code ==='ArrowDown')
        BackgroundOptionUI.Position.Y.value = (parseInt(BackgroundOptionUI.Position.Y.value)+multiplier).toString();
        if(e.code ==='ArrowUp')
        BackgroundOptionUI.Position.Y.value = (parseInt(BackgroundOptionUI.Position.Y.value)-multiplier).toString();
        const inputEvent = new Event('input');
        BackgroundOptionUI.Position.X.dispatchEvent(inputEvent);
        BackgroundOptionUI.Position.Y.dispatchEvent(inputEvent);
});

const button = document.getElementById('btn');
button?.addEventListener('click',()=>{
    app.render();
    const a = document.createElement('a');
    a.download = 'data.png';
    a.href = app.view.toDataURL();
    a.click();
    a.remove();

})