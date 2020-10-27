import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetch: any, params: any = {}, isRequest: boolean = true) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [newParams, setParams] = useState(params);

    const fetchResult = useCallback(async () => {
        if (isRequest) {
            setLoading(true);
            const res: any = await fetch(newParams);
            if (res.ret.errCode === 0) {
                setData(res.data);
            }
            setLoading(false);
        }
    }, [fetch, newParams, isRequest]);

    const fetchData = useCallback((param) => {
        setParams(param);
    }, []);

    const reFetchData = useCallback(() => {
        setParams({...newParams});
    }, []);

    useEffect(() => {
        fetchResult();
    }, [newParams]);

    return {
        data,
        loading,
        fetchData,
        reFetchData
    }
}

export default useFetch;