<h1 id='summary'>Summary</h1>

- [STYLED COMPONENTS](#styled-components)
  - [Package](#package)
  - [Default Theme](#default-theme)
  - [Create Global Style](#create-global-style)
  - [Connecting Styled-Components](#connecting-styled-components)
  - [Create a Styled-Component](#create-a-styled-component)

# STYLED COMPONENTS

## Package

[Go Back to Summary](#summary)

```Bash
  npm i styled-components
```

## Default Theme

[Go Back to Summary](#summary)

- After installing the `styled-component`, we need to create the **DefaultTheme**.
- The **DefaultTheme** is responsible for creating all the global variables. **It's just a big JavaScript object**

  ```JavaScript
    import { DefaultTheme } from 'styled-components';

    const grey = {
        100: 'rgb(230, 230, 230)',
        200: 'rgb(204, 204, 204)',
        300: 'rgb(150, 150, 150)',
        400: 'rgb(110, 110, 110)',
    };

    const green = {
        100: 'rgb(76, 175, 80)',
        200: 'rgb(62, 117, 45)',
        300: 'rgb(74, 84, 77)',
        400: 'rgb(3, 33, 25)',
    };

    export const theme = {
        colors: {
            grey,
            green,
            white: 'rgb(255, 255, 255)',
            black: 'rgb(0, 0, 0)',
            blue: 'rgb(0, 132, 255)',
            red: 'rgb(244, 66, 54)',
        },
        sizes: {
            none: '0rem',
            xtiny: '0.4rem',
            tiny: '0.8rem',
            xsm: '1.2rem',
            sm: '1.4rem',
            md: '1.6rem',
            big: '1.8rem',
            xbig: '2.4rem',
            lg: '2.8rem',
            xl: '3.6rem',
            huge: '4.8rem',
            giant: '6.4rem',
            massive: '7.2rem',
        },
        fontFamily: {
            sans: ['"Open Sans"', 'helvetica', 'sans-serif'].join(', '),
            title: ['"Butler"', 'serif'].join(', '),
            code: ['"Source Code Pro"', 'monospace'].join(', '),
        },
        fontWeight: { normal: 400, bold: 600, heavy: 800 },
        letterSpacing: {
            sm: '0.75px',
            md: '1px',
            lg: '2px',
        },
        borderRadius: {
            small: '2px',
            medium: '4px',
            default: '8px',
            large: '16px',
            circle: '50%',
        },
        borders: {
            main: `2px solid rgba(0,0,0,0.5)`,
        },
        shadows: {
            main: `0 4px 10px rgba(0,0,0,0.5)`,
            button: `0 0.5rem 1.5rem rgba(0,0,0,0.5)`,
            buttonClick: `0 0.2rem 1rem rgba(0,0,0,0.5)`,
        },
    };
  ```

## Create Global Style

[Go Back to Summary](#summary)

- The **GlobalStyle** is just like our base css, where we reset/use all basic css properties. We use `createGlobalStyle` to create the **GlobalStyle** element. We can also import some properties from our **DefaultTheme**

  ```JavaScript
    import { createGlobalStyle } from 'styled-components';
    import { theme } from './theme';

    export const GlobalStyle = createGlobalStyle`
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    *, *:focus {
        outline: none !important;
        box-sizing: inherit;
    }
    html {
        font-size: 62.5%;
        font-family: ${theme.fontFamily['sans']}
    }
    body, #app {
        background: #fff;
        min-height: 100vh;
        box-sizing: border-box;
    }
    a {
        text-decoration: none;
        cursor: pointer;
        color: inherit;
    }
    button {
        border: none;
        background: none;
        cursor: pointer;
    }`;
  ```

## Connecting Styled-Components

[Go Back to Summary](#summary)

- In `src/index.js`

  - we need to import the **ThemeProvider** from `styled-components`
    - The **ThemeProvider** is responsible for connecting (wrapping) the **DefaultThem** that we created to our **App**
    - We need to pass our **DefaultTheme** to the **theme** property
  - Inside our **ThemeProvider** we need to import our **GlobalStyle** (our base style)

  ```JavaScript
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './App';
    import { ThemeProvider } from 'styled-components';
    import { theme } from './css/theme';
    import { GlobalStyle } from './css/base';

    ReactDOM.render(
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <App />
            </ThemeProvider>
        </React.StrictMode>,
        document.getElementById('root')
    );
  ```

## Create a Styled-Component

[Go Back to Summary](#summary)

- in `src/components/Button.style.js`
  - We use `.style.js` to create our styled component
  - We need to import **styled** from `styled-components`
  - Then To create a button we use `styled.button` followed by **` `**. Inside the **` `** we are going to declare all the css properties and media queries for this element

<GlobalStyle /> --> Reset
