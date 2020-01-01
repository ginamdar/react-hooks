import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const {onLoadIngredients} = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef('');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (enteredFilter === inputRef.current.value && enteredFilter.length > 3) {
                const queryParams = `?orderBy="title"&equalTo="${enteredFilter}"`;
                fetch(`https://react-hooks-3a4bc.firebaseio.com/ingredients.json${queryParams}`, {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).then((result) => {
                    return result.json();
                }).then(respData => {
                    const loadedIngs = [];
                    for (const key in respData) {
                        loadedIngs.push({
                            id: key,
                            title: respData[key].title,
                            amount: respData[key].amount
                        })
                    }
                    onLoadIngredients(loadedIngs);
                });
            }
        }, 300);
        return () => {
            clearInterval(timer);
        }
    }, [enteredFilter, onLoadIngredients, inputRef]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input ref={inputRef} type="text" value={enteredFilter} onChange={(event => setEnteredFilter(event.target.value))}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
