'use client'
import { Leva } from 'leva'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/theme-gruvbox_dark_hard';
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/snippets/glsl";
import fragmentShader from './shaders/fragmentShader.glsl'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import useLocalStorage from './useLocalStorage';
import World from './World'
import { toast } from 'react-toastify';


const Shaders = dynamic(() => import('./shaders'), { ssr: false })

export default function Page() {
  const [shader, setShader] = useState(fragmentShader)
  const [editor, setEditor] = useState(true)
  const [myShader, setMyShader] = useLocalStorage('myshader_1', { 'name': 'My Shader 1', 'fragmentShader': shader });
  const saveShader = useCallback(() => {
    const toastId = toast("Saved to My Shader 1")
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 3000);
    setMyShader({ 'name': 'My Shader 1', 'fragmentShader': shader })
  }, [shader]);
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
      <style>{`
        .ace-gruvbox-dark-hard .ace_marker-layer .ace_active-line {
         opacity: 30%;
        }
      `}</style>
      {editor && <AceEditor
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
        flat // default = false,  true removes border radius and shadow
        oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
        hideTitleBar // default = false, hides the GUI header
        collapsed // default = false, when true the GUI is collpased
        hidden
      />
      <div className={`fixed z-30 flex gap-4 top-0 right-0 mt-4 mr-4 ${!editor && 'opacity-0'} hover:opacity-100`}>
        <Shaders className={editor ? 'opacity-20' : 'opacity-0'} onSelect={onChange} myShader={myShader} />
        <button title='Save Shader' onClick={saveShader} className={`h-8 w-8 opacity-15 rounded-[100px] border`} />
        <button title='Presentation Mode' onClick={toggleEditor} className={`h-8 w-8 opacity-15 rounded-lg border`} />
      </div>
      <World shader={shader} />
    </>
  )
}
