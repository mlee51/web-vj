'use client'
import { Leva } from 'leva'
import dynamic from 'next/dynamic'
import { useCallback, useState, useEffect } from 'react'
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

function replaceEffectCode(originalCode, newEffectCode) {
  const effectRegex = /(?<=vec2 effect\(vec2 p, float i, float time\)\s{1,}?{\n)[^\}]+(?=\n})/s;

  // Capture any potential comments within the effect function
  const effectCommentRegex = /(\/\/.*)/g;

  const modifiedCode = originalCode.replace(effectRegex, (match) => {
    // Preserve any comments within the original effect function
    let modifiedMatch = match;
    const comments = match.matchAll(effectCommentRegex);
    if (comments) {
      for (const comment of comments) {
        modifiedMatch = modifiedMatch.replace(comment[0], '');
        newEffectCode = `<span class="math-inline">\{comment\[0\]\}\\n</span>{newEffectCode}`;
      }
    }

    return newEffectCode;
  });

  return modifiedCode;
}

function extract(text) {
  const start = text.indexOf(' {')
  const last = text.lastIndexOf('}')
  const newArray = text.slice(start + 1, last)
  return newArray
}



const Shaders = dynamic(() => import('./shaders'), { ssr: false })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Page() {
  const [shader, setShader] = useState(fragmentShader)
  const [editor, setEditor] = useState(true)
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: 'lava',
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction })
      setPrediction(prediction);
    }
  };

  useEffect(() => {
    if (prediction?.status === 'succeeded') {
      const output = prediction.output
      const effectBlock = extract(output).join('')
      handlePlasma(effectBlock)
    }
  }, [prediction])

  const handlePlasma = (newCode) => {
    setShader(prev => {
      return replaceEffectCode(prev, newCode)
    })
  }

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
        <button title='Ai Regenerate' onClick={handleSubmit} className={`h-8 w-8 opacity-15 rounded-lg border`} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
        </button>
      </div>
      <World shader={shader} />
    </>
  )
}
