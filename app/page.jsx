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
import Shaders from './shaders'
import World from './World'



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
  const onChange = useCallback((newCode) => {
    setShader(newCode);
  }, []);

  const toggleEditor = useCallback(() => {
    setEditor(prev => !prev)
  }, []);


  return (
    <>

      <ToastContainer
        autoClose={false}
      />
      {editor &&
        <AceEditor
          mode="glsl"
          value={shader}
          className='fixed z-20 bg-[rgba(11,11,11,0.17)]'
          theme="gruvbox_dark_hard"
          onChange={onChange}
          fontSize={14}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          showPrintMargin={false}
          width="100%"
          height="100%"
        />}
      <Leva
        fill // default = false,  true makes the pane fill the parent dom node it's rendered in
        flat // default = false,  true removes border radius and shadow
        oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
        hideTitleBar // default = false, hides the GUI header
        collapsed // default = false, when true the GUI is collpased
        hidden // default = false, when true the GUI is hidden
      />
      <div className={`fixed z-30 flex gap-4 top-0 right-0 mt-4 mr-4 ${!editor && 'opacity-0'} hover:opacity-100`}>
        <Shaders className={editor ? 'opacity-20' : 'opacity-0'} onSelect={onChange} />
        <button title='Presentation Mode' onClick={toggleEditor} className={`h-8 w-8 opacity-15 rounded-lg border`} />
      </div>
      <World shader={shader} />
    </>
  )
}
