import { useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic'
import { MeshReflectorMaterial } from '@react-three/drei'
import Screen from './screen'


const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
    ssr: false,
    loading: () => (
        <div className='flex h-96 w-full flex-col items-center justify-center'>
            <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
            </svg>
        </div>
    ),
})
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

const World = ({ shader }) => {
    const displayContent = useMemo(() => (
        <div className='relative  h-full w-full bg-black'>
            <View orbit className='relative  h-full w-full '>
                <Suspense fallback={null}>
                    <Screen fragmentShader={shader} />
                    {/* <Dog scale={1} position={[0, 0, 0]} rotation={[0.0, 0.0, 0]} /> */}
                    <mesh position={[0, -1.6, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
                        <planeGeometry args={[100, 100]} />
                        <MeshReflectorMaterial
                            blur={[800, 200]}
                            resolution={2048}
                            mixBlur={1}
                            mixStrength={100}
                            depthScale={1}
                            minDepthThreshold={0.85}
                            color="#151515"
                            metalness={0.1}
                            roughness={1}
                            mirror={0.5}
                        />
                    </mesh>
                    <Common color={'#17171b'} />
                </Suspense>
            </View>
        </div>
    ), [shader]);

    return displayContent;
}

World.displayName = 'World'
export default World