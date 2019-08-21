import React, {useState, useEffect, useRef} from 'react';
import useHttp from "../../hooks/http";
import Card from '../UI/Card';
import './Search.css';
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo(props => {
    const {onLoadIngredients} = props;
    const [filterState, setFilterState] = useState("");
    const inputRef = useRef();

    const [state, sendRequest, clear] = useHttp();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filterState === inputRef.current.value) {
                const query = filterState.length === 0 ? '' : `?orderBy="title"&equalTo="${filterState}"`;
                sendRequest('https://react-hooks-9390e.firebaseio.com/ingredients.json' + query, 'GET', null, null);
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterState, inputRef, sendRequest]);

    useEffect(() => {
        if(!state.loading && !state.error) {
            const loadedIngredients = [];
            for (const key in state.data) {
                loadedIngredients.push({
                    id: key,
                    title: state.data[key].title,
                    amount: state.data[key].amount
                });
            }
            onLoadIngredients(loadedIngredients);
        }
    }, [state, onLoadIngredients]);

    return (
        <section className="search">
            {state.error && <ErrorModal>{state.error}</ErrorModal>}
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    { state.loading && <span>Loading...</span>}
                    <input ref={inputRef} type="text" value={filterState}
                           onChange={event => setFilterState(event.target.value)}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
