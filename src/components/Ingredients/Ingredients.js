import React, {useReducer, useEffect, useCallback} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

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

const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientReducer, []);
    const [httpState, sendRequest] = useHttp();

    useEffect(() => {
        if (httpState.identifier === 'DELETE' && !httpState.loading && !httpState.error) {
            dispatch({type: 'DELETE', id: httpState.extra});
        } else if (httpState.identifier === 'POST' && !httpState.loading && !httpState.error) {
            dispatch({type: 'ADD', ingredient: {id: httpState.data.name, ...httpState.extra}});
        }
    }, [httpState]);

    const addIngredientsHandler = useCallback(ingredient => {
        sendRequest('https://react-hooks-9390e.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), ingredient);
    }, [sendRequest]);

    const removeIngredientHandler = useCallback(id => {
        sendRequest(`https://react-hooks-9390e.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id);
    }, [sendRequest]);

    const filteredIngredientsHandler = useCallback(filterIngredients => {
        dispatch({type: 'SET', ingredients: filterIngredients});
    }, [dispatch]);

    const clearError = useCallback(() => {
        // httpDispatch({type: 'CLEAR'});
    }, []);

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
