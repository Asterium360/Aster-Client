import React from "react";
import "./css/Button.css";
import { useState } from "react";



const Button = ({ title, action, tooltip, type ="button", "data-testid": testid}) => {
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        if (!action) return;
        setLoading(true);
        try {
            const result = await action();//Ejecuta el metodo CRUD recibido como prop
            console.log(result);
        } catch (error){
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button className="button button-item" title={tooltip} type={type} onClick={handleClick} disabled={loading} data-testid={testid}>
            <span className="button-bg">
                <span className="button-bg-layers">
                    <span className="button-bg-layer button-bg-layer-1 -purple"></span>
                    <span className="button-bg-layer button-bg-layer-2 -turquoise"></span>
                    <span className="button-bg-layer button-bg-layer-3 -yellow"></span>
                </span>
            </span>
            <span className="button-inner">
                <span className="button-inner-static">{loading ? 'Cargando ...': title}</span>
            </span>
        </button>
    );
}

export default Button;
