import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredients, action) => {
    console.log(`action.type:${action.type}`);
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter((ing) => ing.id !== action.id);
        default:
            throw new Error('Should not have come here!');
    }
};

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

const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
    const [httpState, httpDispatch] = useReducer(httpReducer, { loading: false, error: null});
    // const [ ingredients, setUserIngredients ] = useState([]);
    // const [ isLoading, setIsLoading] = useState(false);
    // const [ error, setError] = useState(false);

    useEffect(() => {
        fetch('https://react-hooks-3a4bc.firebaseio.com/ingredients.json', {
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
            // setUserIngredients(loadedIngs);

            dispatch({type: 'SET', ingredients: loadedIngs})
        });
    }, []);

    // useEffect(() => {
    //     console.log('RENDERING:', ingredients);
    // }, ingredients);

    const addIngredientHandler = useCallback(ingredient => {
        // setIsLoading(true);
        httpDispatch({type: 'SEND'});
        fetch('https://react-hooks-3a4bc.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            // setIsLoading(false);
            httpDispatch({type: 'RESPONSE'});
            return result.json();
        }).then(respData => {
            // setUserIngredients(prevIngredients => [...prevIngredients, {
            //     id: respData.name, ...ingredient
            // }])
            httpDispatch({type: 'RESPONSE'});
            dispatch({type: 'ADD', ingredient: {id: respData.name,...ingredient}});
        });
    }, []);

    const removeIngredientHandler = useCallback(id => {
        //setIsLoading(true);
        httpDispatch({type: 'SEND'});
        fetch(`https://react-hooks-3a4bc.firebaseio.com/ingredients/${id}.json`, {
            method: 'DELETE',
        }).then((result) => {
            // setIsLoading(false);
            httpDispatch({type: 'RESPONSE'});
            // setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id))
            dispatch({type: 'DELETE', id});
        }).catch(err => {
            httpDispatch({type: 'ERROR', message: err.message});
            // setError(err.message);
            // setIsLoading(false);
        });
    }, []);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        // setUserIngredients(filteredIngredients);
        dispatch({type: 'SET', filteredIngredients});
    }, []);

    const clearError = () => {
        // setError(null);
        httpDispatch({type: 'CLEAR'});
    };

    const ingLists = useMemo(() => {
        return(
            <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
        )
    }, [ingredients]);

    return(
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredientHandler={addIngredientHandler}
                            loading={httpState.loading}
            />

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {/* Need to add list here! */}
                {ingLists}
            </section>
        </div>
    );
};

export default Ingredients;
