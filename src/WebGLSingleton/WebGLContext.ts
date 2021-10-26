export class WebGLContextManager{
	private static context:WebGL2RenderingContext|null = null;
	public static getWebGLContext(){
		if(this.context === null)
		{
			const canvas = document.getElementById('screen') as HTMLCanvasElement;
			this.context = canvas?.getContext("webgl2") as WebGL2RenderingContext ?? null;
			if(!this.context)
				throw "WebGl not supported or Canvas not found";
			return this.context;
		}
		return this.context;
	}

}