import vertexShader from './shaders/vertexShader.glsl'
//import fragmentShader from './shaders/fragmentShader.glsl'
import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from "three";
import { useThree } from '@react-three/fiber'
import { toast } from 'react-toastify';


const validateGLSL = (gl, code, toastId) => {
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    // Check if compilation succeeded
    const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compileStatus) {
        // Compilation failed, retrieve and log the error message
        const error = gl.getShaderInfoLog(shader);
        toast.dismiss(toastId.current)
        toastId.current = toast.error(`Shader compilation error:${error}`);
    } else {
        toast.dismiss(toastId.current);
    }

    return compileStatus; // Return the compilation status
}
const Screen = ({ fragmentShader }) => {
    const [rawshader, setRawShader] = useState(fragmentShader)
    const { gl } = useThree()
    const canvas = gl.domElement.getContext('webgl2');
    const mesh = useRef()
    const toastId = useRef()


    useEffect(() => {
        if (validateGLSL(canvas, fragmentShader, toastId) === true) {
            setRawShader(fragmentShader)
        }
    }, [fragmentShader])



    const uniforms = useMemo(
        () => ({
            u_time: {
                value: 0.0,
            },
            u_colorA: { value: new Color("#FFE486") },
            u_colorB: { value: new Color("#FEB3D9") },
        }), []
    );
    useFrame((state) => {
        const { clock } = state;
        mesh.current.material.uniforms.u_time.value = clock.getElapsedTime() * 0.3;
    });

    return (
        <mesh ref={mesh} position={[0, 5, -4]}>
            <planeGeometry args={[20, 10]} />
            <shaderMaterial
                uniforms={uniforms}
                fragmentShader={rawshader}
                vertexShader={vertexShader}
                onError={() => alert('error')}
            />
        </mesh>
    )
}

Screen.displayName = 'Screen'
export default Screen