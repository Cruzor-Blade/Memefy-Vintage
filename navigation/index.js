import React from "react";
import { AuthProvider } from "./AuthProvider";
import { ActionProvider } from "../userContext/Actions";
import Routes from './Routes';

const Providers = () =>{
    return (
        <AuthProvider>
            <ActionProvider>
                <Routes/>
            </ActionProvider>
        </AuthProvider> 
        )
}

export default Providers;