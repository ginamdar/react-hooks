import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

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

const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
    const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp();

    useEffect(() => {
        if (!isLoading && !error && reqExtra === 'REMOVE_INGREDIENT') {
            dispatch({type: 'DELETE', id: reqExtra})
        } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
            dispatch({type: 'ADD', ingredient: {
                    id: data.name,
                    ...reqExtra
                }
            })
        }

    }, [isLoading, error, data, reqExtra, reqIdentifier]);

    const addIngredientHandler = useCallback(ingredient => {
        sendRequest('https://react-hooks-3a4bc.firebaseio.com/ingredients.json',
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT'
        )
    }, [sendRequest]);

    const removeIngredientHandler = useCallback(id => {
        sendRequest(
            `https://react-hooks-3a4bc.firebaseio.com/ingredients/${id}.json`,
            'DELETE',
            null,
            id,
            'REMOVE_INGREDIENT'
        );
    }, [sendRequest]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        dispatch({type: 'SET', ingredients: filteredIngredients});
    }, []);

    const ingLists = useMemo(() => {
        return(
            <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
        )
    }, [ingredients, removeIngredientHandler]);

    return(
        <div className="App">
            {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
            <IngredientForm onAddIngredientHandler={addIngredientHandler}
                            loading={isLoading}
            />

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler} />
                {/* Need to add list here! */}
                {ingLists}
            </section>
        </div>
    );
};

export default Ingredients;
