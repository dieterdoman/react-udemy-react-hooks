import React, {useState, useEffect, useCallback} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);

    const addIngredientsHandler = ingredient => {
        fetch('https://react-hooks-9390e.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(responseData => {
            setIngredients(prevState => [...prevState, {id: responseData.name, ...ingredient}]);
        });
    };

    const removeIngredientHandler = id => {
        setIngredients(prevState => prevState.filter(ingredient => ingredient.id !== id));
    };

    const filteredIngredientsHandler = useCallback(filterIngredients => {
        setIngredients(filterIngredients);
    }, [setIngredients]);

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientsHandler}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
};

export default Ingredients;
