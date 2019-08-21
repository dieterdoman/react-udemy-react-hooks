import React, {useReducer, useState, useCallback} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...state, action.ingredient];
        case 'DELETE':
            return state.filter(ingredient => ingredient.id !== action.id);
        default:
            throw new Error('Should not get here');
    }
};

const httpReducer = (state, action) => {
    switch (action.type) {
        case 'SEND':
            return {
                loading: true,
                error: null
            };
        case 'RESPONSE':
            return {
                ...state,
                loading: false
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

const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientReducer, []);
    const [httpState, httpDispatch] = useReducer(httpReducer, {loading: false, error: null});

    const addIngredientsHandler = ingredient => {
        httpDispatch({type: 'SEND'});
        fetch('https://react-hooks-9390e.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(responseData => {
            dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
            httpDispatch({type: 'RESPONSE'});
        }).catch(error => {
            httpDispatch({type: 'ERROR', error: error.message})
        });
    };

    const removeIngredientHandler = id => {
        httpDispatch({type: 'SEND'});
        fetch(`https://react-hooks-9390e.firebaseio.com/ingredients/${id}.json`, {
            method: 'DELETE'
        }).then(response => {
            dispatch({type: 'DELETE', id: id});
            httpDispatch({type: 'RESPONSE'});
        }).catch(error => {
            httpDispatch({type: 'ERROR', error: error.message})
        });
    };

    const filteredIngredientsHandler = useCallback(filterIngredients => {
        dispatch({type: 'SET', ingredients: filterIngredients});
    }, []);

    const clearError = () => {
        httpDispatch({type: 'CLEAR'});
    };

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientsHandler} loading={httpState.loading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
};

export default Ingredients;
