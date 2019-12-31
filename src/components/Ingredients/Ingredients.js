import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
    const [ ingredients, setUserIngredients ] = useState([]);
    const [ isLoading, setIsLoading] = useState(false);
    const [ error, setError] = useState(false);

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
            setUserIngredients(loadedIngs);
        });
    }, []);

    // useEffect(() => {
    //     console.log('RENDERING:', ingredients);
    // }, ingredients);

    const addIngredientHandler = ingredient => {
        setIsLoading(true);
        fetch('https://react-hooks-3a4bc.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            setIsLoading(false);
            return result.json();
        }).then(respData => {
            setUserIngredients(prevIngredients => [...prevIngredients, {
                id: respData.name, ...ingredient
            }])
        });
    };

    const removeIngredientHandler = id => {
        setIsLoading(true);
        const queryParam = `?${id}`;
        fetch(`https://react-hooks-3a4bc.firebaseio.com/ingredients.on?${id}`, {
            method: 'DELETE',
        }).then((result) => {
            setIsLoading(false);
            setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id))
        }).catch(err => {
            setError(err.message);
            setIsLoading(false);
        });
    };

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setUserIngredients(filteredIngredients);
    }, []);

    const clearError = () => {
        setError(null);
    };

    return(
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredientHandler={addIngredientHandler}
                            loading={isLoading}
            />

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {/* Need to add list here! */}
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
};

export default Ingredients;
