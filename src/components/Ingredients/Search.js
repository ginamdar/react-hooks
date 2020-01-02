import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
    const {onLoadIngredients} = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const {isLoading, data, error, sendRequest, clear} = useHttp();
    const inputRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (enteredFilter === inputRef.current.value ) {
                const queryParams = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
                sendRequest(
                    'https://react-hooks-3a4bc.firebaseio.com/ingredients.json' + queryParams,
                    'GET'
                );
                // fetch(, {
                //     headers:{
                //         'Content-Type': 'application/json'
                //     }
                // }).then((result) => {
                //     return result.json();
                // }).then(respData => {
                //     const loadedIngs = [];
                //     for (const key in respData) {
                //         loadedIngs.push({
                //             id: key,
                //             title: respData[key].title,
                //             amount: respData[key].amount
                //         })
                //     }
                //     onLoadIngredients(loadedIngs);
                // });
            }
        }, 300);
        return () => {
            clearTimeout(timer);
        };
    }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);

    return (
        <section className="search">
            {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    {isLoading && <span>Loading...</span>}
                    <input
                        ref={inputRef}
                        type="text"
                        value={enteredFilter}
                        onChange={event => setEnteredFilter(event.target.value)}
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;
