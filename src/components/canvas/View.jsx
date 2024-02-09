'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useControls } from 'leva'


export const Common = ({ color }) => {

  const config = useControls({
    intensity: 4.0,
    luminanceThreshold: { value: 0.31, step: 0.1 }, // luminance threshold. Raise this value to mask out darker elements in the scene.
    luminanceSmoothing: { value: 0.12, step: 0.1 }, // smoothness of the luminance threshold. Range is [0, 1]
    mipmapBlur: true, // Enables or disables mipmap blur.
  })
  return (
    <Suspense fallback={null}>
      {color && <color attach='background' args={[color]} />}
      <fog attach="fog" args={['#17171b', 30, 40]} />
      <ambientLight />
      <pointLight position={[20, 30, 10]} intensity={3} decay={0.2} />
      <pointLight position={[-10, -10, -10]} color='blue' decay={0.2} />
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 35]} />
      <EffectComposer>
        <Bloom {...config} height={300} />
      </EffectComposer>
    </Suspense>
  )
}

const View = forwardRef(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
