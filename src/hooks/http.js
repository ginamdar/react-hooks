const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...httpState, loading: false};
        case 'ERROR':
            return {loading:false, error: action.message};
        case 'CLEAR':
            return {...httpState, error: null};
        default:
            throw new Error('Should not have come here');
    }
};

const useHttp = () => {

};

export default useHttp;
