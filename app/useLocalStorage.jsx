'use client'
import React, { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {
    // Get value from local storage, or use initial value
    const [state, setState] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        }
    })

    // Update local storage when state changes
    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(key, JSON.stringify(state));
        }
    }, [key, state]);

    return [state, setState];
}
