import { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";
import "../app.css"

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM, SET_NEWLY_ADDED } from "../constants";
import { useLocation } from "react-router-dom";

export const Item = memo(function Item({ todo, dispatch, index ,size}) {
    const [isWritable, setIsWritable] = useState(false);
    const { title, completed, id ,isNewlyAdded ,createdAt,updatedAt} = todo;

    const { pathname: route } = useLocation();

    const toggleItem = useCallback(() => dispatch({ type: TOGGLE_ITEM, payload: { id } }), [dispatch]);
    const removeItem = useCallback(() => dispatch({ type: REMOVE_ITEM, payload: { id } }), [dispatch]);
    const updateItem = useCallback((id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }), [dispatch]);
    const updateItemColor = useCallback((id) => dispatch({ type: SET_NEWLY_ADDED, payload: { id} }), [dispatch]);

    const handleDoubleClick = useCallback(() => {
        setIsWritable(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsWritable(false);
    }, []);

    const handleUpdate = useCallback(
        (title) => {
            if (title.length === 0)
                removeItem(id);
            else
                updateItem(id, title);

            setIsWritable(false);
        },
        [id, removeItem, updateItem]
    );
    useEffect(()=>{
       let timer= setTimeout(()=>{
            updateItemColor(id)
        },15000)

        return ()=>clearTimeout(timer)
    },[])

    let labelClass=classnames({
        newly_added:isNewlyAdded
    })

    if(route=='/completed'){
        labelClass=classnames({
            last:index===size-1,
            second_last:index===size-2,
            third_last:index===size-3
        })
    }
  
     

    return (
        <li className={classnames({completed:todo.completed,})} data-testid="todo-item">
            <div className="view">
                {isWritable ? (
                    <Input onSubmit={handleUpdate} label="Edit Todo Input" defaultValue={title} onBlur={handleBlur} />
                ) : (
                    <>
                        <input className="toggle" type="checkbox" data-testid="todo-item-toggle" checked={completed} onChange={toggleItem} />
                        <label data-testid="todo-item-label" onDoubleClick={handleDoubleClick} className={labelClass} >
                            {title}45
                        </label>
                        <span>{createdAt.toUTCString()}</span>
                        {completed && <span>{updatedAt.toUTCString()}</span>}
                        <button className="destroy" data-testid="todo-item-button" onClick={removeItem} />
                    </>
                )}
            </div>
        </li>
    );
});
