function Init_WebGLContext(){
	const canvas = document.getElementById('screen') as HTMLCanvasElement;
	const gl = canvas?.getContext("webgl2") as WebGL2RenderingContext ?? null;
	if(!gl)
		console.error("WebGl not supported or Canvas not found");
	return gl;
}

function main(){
	const gl = Init_WebGLContext();
	
	gl.clearColor(1,0,0,1);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}

main();