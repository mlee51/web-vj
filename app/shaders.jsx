'use client'
import shaderExamples from './shaders/examples.json'
import { useEffect, useState, useCallback } from 'react';

const Shaders = ({ className, onSelect, myShader }) => {
    const [selectedExample, setSelectedExample] = useState(null);

    const handleExampleChange = useCallback((event) => {
        setSelectedExample(event.target.value);
    }, []);

    useEffect(() => {
        if (selectedExample !== null) onSelect(selectedExample)
    }, [selectedExample])


    return (
        <select className={`bg-transparent text-white border rounded-lg px-2 opacity-20 ${' ' + className}`} defaultValue={0} onChange={handleExampleChange}>
            {shaderExamples.examples.map((item, index) => (<option id={index} key={index} value={item.fragmentShader}>{item.name}</option>))}
            <option value={myShader.fragmentShader}>{myShader.name}</option>
        </select>
    )
}

export default Shaders