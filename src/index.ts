import vertexShaderText from "./vertexShader.glsl";
import fragmentShaderText from "./fragment.glsl";
import {WebGLContextManager} from "./WebGLSingleton";
import {Shader} from "./Shaders";
import  {ReadonlyVec2, vec2} from 'gl-matrix';

function pixelToLocal(out:vec2,_v:ReadonlyVec2){
	// convert pixel unit to normalize screen space webgl [-1:1]
	const dim = WebGLContextManager.getDimension();
	out[0] = _v[0]/dim.width;
	out[1] = _v[1]/dim.height;
}
class Line{
	private vertices:vec2[] = [];
	private	RenderedVertex:number[] = [];
	private thickness:number;
	private oldVerticesCount = 0;
	constructor(thickness:number){
		this.thickness = thickness;
	}
	public AddVertex(vertex:vec2|vec2[]){
		if(Array.isArray(vertex))
			this.AddArray(vertex as vec2[]);
		else
			this.AddSingle(vertex);
		this.calcVertex();
	}
	private AddArray(_v:vec2[]){
		this.vertices.push(..._v);
	}
	private AddSingle(_v:vec2){
		this.vertices.push(_v);
	}

	private calcVertex(){
		if(this.vertices.length < 2) return;
		console.log(this.oldVerticesCount)
		for(let i = this.oldVerticesCount;i< this.vertices.length-1;++i)
		{
			const startV = this.vertices[i];
			const endV = this.vertices[i+1];
			let nVector:vec2 = [0,0];
			vec2.sub(nVector,endV,startV);
			vec2.normalize(nVector,nVector);
			vec2.scale(nVector,nVector,this.thickness);
			let nVector1:vec2 = [nVector[1],-nVector[0]] //get Normal Vector
			console.log(nVector);
			pixelToLocal(nVector1,nVector1);
			let c:vec2 = [0,0];
			let d:vec2 = [0,0];
			vec2.add(c,startV,nVector1);
			vec2.add(d,endV,nVector1);
			console.log(c,d);
			this.RenderedVertex.push(...startV,...c,...endV,...c,...endV,...d);
		}
	}
	get Vertices(){
		return this.RenderedVertex;
	}
}












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
	const line = new Line(50);
	line.AddVertex([[-0.8,0],[-0.1,0.0],[0.5,0.5],[0.5,-0.5]]);
	console.log(line);
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line.Vertices), gl.STATIC_DRAW);
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
	gl.drawArrays(gl.TRIANGLES, 0,18);
	

	// const draw = () =>{
	// 	console.log("test");
	// 	requestAnimationFrame(draw);
	// }
	// requestAnimationFrame(draw)
}

main();