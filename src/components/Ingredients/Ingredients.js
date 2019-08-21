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
        default: throw new Error('Should not get here');
    }
};

const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientReducer, []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const addIngredientsHandler = ingredient => {
        setIsLoading(true);
        fetch('https://react-hooks-9390e.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(responseData => {
            dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
            setIsLoading(false);
        }).catch(error => {
            setError(error.message);
            setIsLoading(false);
        });
    };

    const removeIngredientHandler = id => {
        setIsLoading(true);
        fetch(`https://react-hooks-9390e.firebaseio.com/ingredients/${id}.json`, {
            method: 'DELETE'
        }).then(response => {
            dispatch({type: 'DELETE', id: id});
            setIsLoading(false);
        }).catch(error => {
            setError(error.message);
            setIsLoading(false);
        });
    };

    const filteredIngredientsHandler = useCallback(filterIngredients => {
        dispatch({type: 'SET', ingredients: filterIngredients});
    }, []);

    const clearError = () => {
        setError(null);
    };

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientsHandler} loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
};

export default Ingredients;
