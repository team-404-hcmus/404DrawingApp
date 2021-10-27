export class WebGLContextManager{
	private static context:WebGL2RenderingContext|null = null;
	private static canvas = document.getElementById('screen') as HTMLCanvasElement;
	public static getWebGLContext(){
		if(this.canvas ===null)
			this.canvas = document.getElementById('screen') as HTMLCanvasElement;
		if(this.context === null)
		{
			
			this.context = this.canvas?.getContext("webgl2") as WebGL2RenderingContext ?? null;
			if(!this.context)
				throw "WebGl not supported or Canvas not found";
			return this.context;
		}
		return this.context;
	}
	public static getDimension(){
		if(this.canvas === null)
			this.canvas = document.getElementById('screen') as HTMLCanvasElement;
		return {width:this.canvas.width,height:this.canvas.height}
	}
	public static getCanvas(){
		if(this.canvas === null)
		{

			this.canvas = document.getElementById('screen') as HTMLCanvasElement;
			return this.canvas;
		}
			
		return this.canvas
	}

}