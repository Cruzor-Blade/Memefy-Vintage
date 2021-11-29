import React from "react";
import { AuthProvider } from "./AuthProvider";
import { ActionProvider } from "../userContext/Actions";
import { LanguageProvider } from "../languages/languageContext";
import Routes from './Routes';

const Providers = () =>{
    return (
        <LanguageProvider>
            <AuthProvider>
                <ActionProvider>
                    <Routes/>
                </ActionProvider>
            </AuthProvider> 
        </LanguageProvider>
        )
}

export default Providers;