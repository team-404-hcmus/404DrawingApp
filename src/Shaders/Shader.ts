import {WebGLContextManager} from "../WebGLSingleton"; 
export default class Shader{
	private static gl = WebGLContextManager.getWebGLContext();
	private static createShader(text:string,type:number){
		let shader = Shader.gl.createShader(type);
		if(shader ===null) throw {errno:errono.CREATESHADER,msg:'cannot create Shader'};
		Shader.gl.shaderSource(shader, text);

		Shader.gl.compileShader(shader);
		if (!Shader.gl.getShaderParameter(shader, Shader.gl.COMPILE_STATUS)) {
			console.error('ERROR compiling vertex shader!', Shader.gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}
	public static createVertexShader(text:string){
		return Shader.createShader(text,Shader.gl.VERTEX_SHADER);
	}
	public static createFragmentShader(text:string){
		return Shader.createShader(text,Shader.gl.FRAGMENT_SHADER);
	}
}

enum errono{
	CREATESHADER,

}