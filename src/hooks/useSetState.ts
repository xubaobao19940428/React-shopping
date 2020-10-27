import { useState, useCallback } from 'react';

const useSetState = (initState: any = {}) => {
    const [state, updateState] = useState(initState);
    const setState = useCallback((sta: any, callback: (nextState: any) => {}) => {
        const nextSta = {...state, ...sta};
        updateState(nextSta);
        callback(nextSta);
    }, []);

    return { state, setState }
}

export default useSetState;