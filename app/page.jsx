'use client'

import { MeshReflectorMaterial } from '@react-three/drei'
import { Leva } from 'leva'
import dynamic from 'next/dynamic'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Screen from './screen'
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/theme-gruvbox_dark_hard';
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/snippets/glsl";
import fragmentShader from './shaders/fragmentShader.glsl'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
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
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })



export default function Page() {
  const [shader, setShader] = useState(fragmentShader)
  const [editor, setEditor] = useState(true)
  const onChange = (newCode) => {
    setShader(newCode);
  };

  const toggleEditor = useCallback(() => {
    setEditor(prev => !prev)
  }, []);



  return (
    <>
      {editor && <>
        <ToastContainer
          autoClose={false}
        />
        <AceEditor
          mode="glsl"
          value={shader}
          className="fixed z-20 bg-transparent"
          theme="gruvbox_dark_hard"
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          showPrintMargin={false}
          width="100%"
          height="100%"
        /></>}
      <Leva
        fill // default = false,  true makes the pane fill the parent dom node it's rendered in
        flat // default = false,  true removes border radius and shadow
        oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
        hideTitleBar // default = false, hides the GUI header
        collapsed // default = false, when true the GUI is collpased
        hidden // default = false, when true the GUI is hidden
      />
      <button onClick={toggleEditor} className={`fixed z-30 h-8 w-8 top-0 right-0 mt-4 mr-4 opacity-15 rounded-lg ${editor ? 'border' : 'hover:border'}`} />
      <div className='relative  h-full w-full bg-black'>
        <View orbit className='relative  h-full w-full '>
          <Suspense fallback={null}>
            <Screen fragmentShader={shader} />
            <Dog scale={1} position={[0, 0, 0]} rotation={[0.0, 0.0, 0]} />
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
    </>
  )
}
