import React, {useState, useEffect, useCallback} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);
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
            setIngredients(prevState => [...prevState, {id: responseData.name, ...ingredient}]);
            setIsLoading(false);
        });
    };

    const removeIngredientHandler = id => {
        setIsLoading(true);
        fetch(`https://react-hooks-9390e.firebaseio.com/ingredients/${id}.json`, {
            method: 'DELETE'
        }).then(response => {
            setIngredients(prevState => prevState.filter(ingredient => ingredient.id !== id));
            setIsLoading(false);
        }).catch(error => {
            setError(error.message);
            setIsLoading(false);
        });
    };

    const filteredIngredientsHandler = useCallback(filterIngredients => {
        setIngredients(filterIngredients);
    }, [setIngredients]);

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
