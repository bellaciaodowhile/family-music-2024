import { useState } from "react";

export const useForm = (INITIAL_FORM = {}) => {
    
    const [formState, setFormState] = useState(INITIAL_FORM);

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        
        setFormState({
            ...formState,
            [name]: value
        });
    }
    return {
        formState, 
        onInputChange,
        setFormState
    }
}