import React, {useState, useEffect} from 'react';
import IngredientList from "./IngredientList";
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        fetch('https://react-hooks-9390e.firebaseio.com/ingredients.json').then(response => {
            return response.json();
        }).then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
                loadedIngredients.push({
                    id: key,
                    title: responseData[key].title,
                    amount: responseData[key].amount
                });
                setIngredients(loadedIngredients);
            }
        });
    }, []);

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
