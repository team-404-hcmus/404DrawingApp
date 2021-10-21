/**@type {HTMLCanvasElement} */
const canvas  = document.getElementById("screen")
const gl = canvas.getContext('webgl');
if (gl !== null) {
	main(gl);
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 */
function main(gl){
 gl.clearColor(0.0, 0.0, 0.0, 1.0);
 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}