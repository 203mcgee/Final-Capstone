
import React from 'react'
import { createContext, useState } from 'react'
import ReactSwitch from "react-switch";
// import "./index.css"

// import { ThemeContext } from 'styled-components';
// import 'App.css'
// https://github.com/machadop1407/dark-light-mode-react/blob/main/src/App.js
const ThemeContext = createContext(null);

const ThemeProvider = ({children}) => {

    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((curr) => (curr === "light" ? "dark" : "light"));
    }

    return (
        <>
            <ThemeContext.Provider value={{theme,toggleTheme}}>
                <div className='app' id={theme}>
                    {/* <App/> */}
                    <div className='switch'>
                        {/* <label className='gap-0.5 text-sm'>{theme === "light" ? "Light Mode " : "Dark Mode "}</label> */}
                        <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
                    </div>
                    {children}
                </div>

            </ThemeContext.Provider>
        </>
    )
}

export default ThemeProvider;