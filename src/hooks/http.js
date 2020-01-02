import {useReducer, useCallback} from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
};

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null, extra: null, identifier: action.identifier};
        case 'RESPONSE':
            return {...httpState, loading: false, data: action.data, extra: action.extra};
        case 'ERROR':
            return {loading:false, error: action.message};
        case 'CLEAR':
            return initialState;
        default:
            throw new Error('Should not have come here');
    }
};

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => httpDispatch({type: 'CLEAR'}), []);

    const sendRequest = useCallback((url, methodType, body, reqExtra, reqIdentifier) => {
        httpDispatch({type: 'SEND', identifier: reqIdentifier});
        fetch(url, {
            method: methodType,
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(result => { return result.json()})
            .then((result) => {
                httpDispatch({
                    type: 'RESPONSE',
                    data: result,
                    extra: reqExtra
                });
            })
            .catch(err => {
            httpDispatch({
                type: 'ERROR',
                message: err.message
            });
        });
    }, []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear
    };
};

export default useHttp;
