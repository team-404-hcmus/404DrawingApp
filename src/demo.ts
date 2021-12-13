/*

	Get the WebGl context from htmlCanvas Element

*/

const canvas = document.getElementById("scene") as HTMLCanvasElement;
const WebGlContext = canvas.getContext("webgl2");



/*
	Shader usually save in string (or use glsl file and pack with js via webpack technology)
	Create Shader:
		Vertex Shader.
*/

const VertexShaderString = `
precision mediump float;
attribute vec2 vertPosition;
attribute vec3 vertColor;
void main()
{

  gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

const VertexShader = WebGlContext?.createShader(WebGlContext.VERTEX_SHADER) as WebGLShader;
WebGlContext?.shaderSource(VertexShader,VertexShaderString);

/*
	Shader usually save in string (or use glsl file and pack with js via webpack technology)
	Create Shader:
		Vertex Shader.
*/
const FragmentShaderString = `
precision mediump float;
void main()
{
  gl_FragColor = vec4(1.0,0.0,0.0, 1.0);
}
`;
const FragmentShader = WebGlContext?.createShader(WebGlContext.FRAGMENT_SHADER) as WebGLShader;
WebGlContext?.shaderSource(FragmentShader,FragmentShaderString);


/*
	Create a program.
	a program is a rendering pipeline.
	each shader attach order is according to their processing order.
*/

const mainProgram = WebGlContext?.createProgram() as WebGLProgram;
WebGlContext?.attachShader(mainProgram,VertexShader);
WebGlContext?.attachShader(mainProgram,FragmentShader);
WebGlContext?.linkProgram(mainProgram);
//check if program is created successfully
if (!WebGlContext?.getProgramParameter(mainProgram, WebGlContext?.LINK_STATUS)) {
	console.error('ERROR linking program!', WebGlContext?.getProgramInfoLog(WebGlContext));
	throw 'ERROR linking program!';
}

WebGlContext?.validateProgram(mainProgram);
if (!WebGlContext?.getProgramParameter(mainProgram, WebGlContext.VALIDATE_STATUS)) {
	console.error('ERROR validating program!', WebGlContext?.getProgramInfoLog(WebGlContext));
	throw 'ERROR linking program!';
}


// create data buffer
// this buffer contain vertex coordinate info
let vertexBuffer = WebGlContext.createBuffer();
//bind buffer to vertexBuffer
WebGlContext.bindBuffer(WebGlContext.ARRAY_BUFFER,vertexBuffer);
// write data to buffer with bufferData function
WebGlContext.bufferData(WebGlContext.ARRAY_BUFFER,new Float32Array([]),WebGlContext.STATIC_DRAW);
let positionAttrLocation = WebGlContext.getAttribLocation(mainProgram,'vertPosition'); //vertPosition is the name of variable in shader
WebGlContext.vertexAttribPointer(positionAttrLocation,2,WebGlContext.FLOAT,false,2*Float32Array.BYTES_PER_ELEMENT,0);
WebGlContext.enableVertexAttribArray(positionAttrLocation);
gl