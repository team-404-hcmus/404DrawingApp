import vertexShaderText from "./vertexShader.glsl";
import fragmentShaderText from "./fragment.glsl";
import {WebGLContextManager} from "./WebGLSingleton";
import {Shader} from "./Shaders";
function main(){
	const gl = WebGLContextManager.getWebGLContext();
	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	let vertexShader = Shader.createVertexShader(vertexShaderText);
	let fragmentShader = Shader.createFragmentShader(fragmentShaderText);
	if(vertexShader === null || fragmentShader ===null) throw '';
	let program = gl.createProgram();
	if(program === null) throw '';
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	let triangleVertices = 
	[ // X, Y,       R, G, B
		0.0, 0.5,
		-0.5, -0.5,
		0.5, -0.5
	];
	
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		false,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	//
	// Main render loop
	//
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	setTimeout(() => {
		let _triangleVertices = 
		[ // X, Y,       R, G, B
			0.0, -0.5,
			-0.5, 0.5,
			0.5, 0.5
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_triangleVertices), gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}, 1500);
	

	// const draw = () =>{
	// 	console.log("test");
	// 	requestAnimationFrame(draw);
	// }
	// requestAnimationFrame(draw)
}

main();