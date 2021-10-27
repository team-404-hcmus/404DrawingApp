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
function recTangleToTri(arr:vec2[]){

}
class Line{
	private vertices:vec2[] = [];
	private	RenderedVertex:number[] = [];
	private thickness:number;
	//private oldVerticesCount = 0;
	private loop = false;
	constructor(thickness = 1,loop = false){
		this.thickness = thickness;
		this.loop = loop;
	}
	public AddVertex(vertex:vec2|vec2[]){
		if(this.loop)
			this.vertices.pop();
		if(Array.isArray(vertex))
			this.AddArray(vertex as vec2[]);
		else
			this.AddSingle(vertex);
		if(this.loop)
			this.vertices.push(this.vertices[0]);
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
		// pls avoid magic number
		const lastElementIndex = this.vertices.length-1;
		// pls avoid magic number
		const halfThickness = this.thickness/2;
		let normalVectorArray:vec2[] = [];
		for(let i = 0;i< lastElementIndex;++i)
		{
			// startPont ------- nextPoint --------- endPoint
			const nextIndex = i+ 1;
			const afterNextIndex = i+2;
			let uVector:vec2 = vec2.create();
			vec2.subtract(uVector,this.vertices[nextIndex],this.vertices[i]);
			let normalVector:vec2 = [uVector[1],-uVector[0]];
			vec2.normalize(normalVector,normalVector)
			let t = vec2.create();	
			vec2.scale(t,normalVector,halfThickness);
			pixelToLocal(t,t);
			if(i === 0)			
			{
				let left = vec2.create();
				let right = vec2.create();
				vec2.add(right,this.vertices[i],t);
				vec2.subtract(left,this.vertices[i],t);
				this.RenderedVertex.push(...left,...right);
			}
			if(nextIndex >= lastElementIndex)
			{
				const lastRight = [
					this.RenderedVertex[this.RenderedVertex.length-2],
					this.RenderedVertex[this.RenderedVertex.length-1]
							]
				let left = vec2.create();
				let right = vec2.create();
				vec2.add(right,this.vertices[nextIndex],t);
				vec2.subtract(left,this.vertices[nextIndex],t);
				this.RenderedVertex.push(...left,...lastRight,...right,...left);
			}
			else{
				let uVector:vec2 = vec2.create();
				vec2.subtract(uVector,this.vertices[afterNextIndex],this.vertices[nextIndex]);
				vec2.normalize(uVector,uVector);
				let normal2:vec2 = [uVector[1],-uVector[0]];
				let angle = vec2.create();
				vec2.add(angle,normal2,normalVector);
				vec2.normalize(angle,angle);
				let cos = vec2.dot(angle,uVector);
				let sin = Math.sqrt(1-cos*cos);
				vec2.scale(angle,angle,halfThickness/sin);
				let left = vec2.create();
				let right = vec2.create();
				const lastRight = [
					this.RenderedVertex[this.RenderedVertex.length-2],
					this.RenderedVertex[this.RenderedVertex.length-1]
				]
				pixelToLocal(angle,angle);
				vec2.add(right,this.vertices[nextIndex],angle);
				vec2.subtract(left,this.vertices[nextIndex],angle);
				console.log()
				this.RenderedVertex.push(...left,...lastRight,...right,...left,...left,...right);
				
			}

		}
		// |B|.Sin(theta) = Half_thickness
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
	const line = new Line(50,true);
	const generateBezier = (start:vec2,anchor:vec2,end:vec2,step = 0.2)=>{
		const arr:vec2[] = [];
		for(let i = 0; i <= 1; i+= step)
		{
			const result = vec2.create();
			vec2.lerp(result,vec2.lerp(result, start,anchor,i),end,i);
			arr.push(result);
		}
		return arr;
	}
	line.AddVertex(generateBezier([-0.5,0],[-1,-1],[0.5,0],0.01));
	
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
		gl.drawArrays(gl.TRIANGLES, 0,line.Vertices.length);
		
		
		// const draw = () =>{
			// 	console.log("test");
			// 	requestAnimationFrame(draw);
			// }
			// requestAnimationFrame(draw)
		}
		
		main();
		