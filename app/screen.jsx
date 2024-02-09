import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from "three";

const Screen = () => {
    const mesh = useRef()

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
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
            />
        </mesh>
    )
}

Screen.displayName = 'Screen'
export default Screen