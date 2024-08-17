import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";

function ModelLoader({ url }) { // You can also use props for the file itself

    const [gltf, setGltf] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            const response = await fetch(url); // Assuming URL is provided as a prop
            const data = await response.blob();
            setGltf(data);
        };

        if (url) { // Load model if URL is available
            loadModel();
        }
    }, [url]); // Re-run effect when URL changes

    return (
        <>
            {/* {gltf && <primitive object={useLoader(GLTFLoader, new Blob([gltf], { type: "application/gltf+json" }))} />} */}
        </>
    );
}

export default ModelLoader;
