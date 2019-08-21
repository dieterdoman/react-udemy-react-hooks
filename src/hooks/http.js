import {useReducer, useCallback} from 'react';

const httpReducer = (state, action) => {
    switch (action.type) {
        case 'SEND':
            return {
                loading: true,
                error: null,
                data: null,
                extra: null,
                identifier: action.identifier
            };
        case 'RESPONSE':
            return {
                ...state,
                loading: false,
                data: action.responseData,
                extra: action.extra
            };
        case 'ERROR':
            return {
                loading: false,
                error: action.error
            };
        case 'CLEAR':
            return {
                ...state,
                error: null
            };
        default:
            throw new Error("Should not get here");
    }
};

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, {
        loading: false,
        error: null,
        data: null,
        extra: null,
        identifier: null
    });

    const sendRequest = useCallback((url, method, body, extra) => {
        httpDispatch({type: 'SEND', identifier: method});
        fetch(url, {
            method: method,
            body: body,
            headers: {'Content-Type': 'application/json'}
        }).then(responseData => {
            return responseData.json();
        }).then(response => {
            httpDispatch({type: 'RESPONSE', responseData: response, extra: extra});
        }).catch(error => {
            httpDispatch({type: 'ERROR', error: error.message})
        });
    }, []);

    return [httpState, sendRequest];
};

export default useHttp;
