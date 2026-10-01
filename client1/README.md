# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



<!-- README from Zoe McGee -->
# Overview 

I have created a portfolio that is Single Page Application. 

## Single Page Application
```
_______________
│   App.css
│   App.jsx
│   index.css
│   main.jsx
│   README.md
│   
├───assets
│   └───images
│           prof_profile.jpeg
│           
├───components
│       Button.jsx
│       Footer.jsx
│       Hero.jsx
│       Navbar.jsx
│       PText.jsx
│       Result.jsx
│       SearchBar.jsx
│       SearchResults.jsx
│       ThemeProvider.jsx
│       Timeline.jsx
│       
├───hooks
│       useFetch.js
│       
└───pages
        Contact.jsx
        ExperienceSkills.jsx
        HomePage.jsx
        Projects.jsx
```

## Architectural Breakdown

The way this programs moves is by using multiple components , pages, and a hook. First, the theme provider is used in the main.jsx file. This helps the SPA change into light or dark mode. In the App.jsx file, I have the main routes page and it shows the routes of my four main pages. Some of the components are used in experience and skills page and projects page. The useFetch.js is a hook used to get repositories from github. 

## Context System Layout

The Theme provider is used in the main.jsx so it could be used fully throughout the program. Browser context is used to for location matching.

## Hook cycle setup

This project relies on useEffect which uses useEffect and useState 

## Self Audit Confirmation

1.Console Errors 

Works fine with npm run dev and npm run build.

2.Render Cycles

It has no way to be in an infinite loop and side effects in the code.

3.Theme Consistency

Theme is generally is consistent throughout the page.

4.Build Integrity

Has been used to Tailwindcss and CSS

