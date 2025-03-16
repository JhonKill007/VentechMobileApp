/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    currentTheme: 'light',
    dark: false,
    dividerColor: 'rgba(0,0,0,0.7)',
    colors: {
        primary: 'black',
        background: 'white',
        details:'#3F75EA',
        card: 'white',
        text: 'black',
        border: 'gray',
        notification: 'red',
    },
  },
  dark: {
    currentTheme: 'dark',
    dark: true,
    dividerColor: 'rgba(0,0,0,0.7)',
    colors: {
        primary: 'white',
        background: 'black',
        details:'#3F75EA',
        card: 'black',
        text: 'white',
        border: 'gray',
        notification: 'red',
    },
  },
};
