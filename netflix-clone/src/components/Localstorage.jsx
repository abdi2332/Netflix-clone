// useLocalStorageList.js
import { useState, useEffect } from 'react';

const useLocalStorageList = (key) => {
    const [list, setList] = useState(() => {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : [];
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(list));
    }, [key, list]);

    return [list, setList];
};

export default useLocalStorageList;
