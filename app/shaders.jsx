import fragmentShader from './shaders/fragmentShader.glsl'
import shaderExamples from './shaders/examples.json'
import { useEffect, useState } from 'react';
const Shaders = ({ className, onSelect }) => {
    const [selectedExample, setSelectedExample] = useState(null);

    const handleExampleChange = (event) => {
        setSelectedExample(event.target.value);
    };

    useEffect(() => {
        if (selectedExample !== null) onSelect(selectedExample)
    }, [selectedExample])


    return (
        <select className={`bg-transparent text-white border rounded-lg opacity-20 ${' ' + className}`} defaultValue={0} onChange={handleExampleChange}>
            {shaderExamples.examples.map((item, index) => (<option id={index} key={index} value={item.fragmentShader}>{item.name}</option>))}
        </select>
    )
}

export default Shaders