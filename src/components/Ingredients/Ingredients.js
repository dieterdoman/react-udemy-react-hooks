import React, {useState} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);

    const addIngredientsHandler = ingredient => {
        setIngredients(prevState => [...prevState, {id: Math.random().toString(), ...ingredient}]);
    };

    const removeIngredientHandler = id => {
        setIngredients(prevState => prevState.filter(ingredient => ingredient.id !== id));
    };

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientsHandler}/>

            <section>
                <Search/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
};

export default Ingredients;
