import mitt from "mitt";
import {useLocalStorageState} from "ahooks";

export const light = 'light';
export const dark = 'dark';

export type Theme =  '' |  'dark' | 'toggle';

type ThemeEvent = {
    changeTheme: Theme
}

const emitter = mitt<ThemeEvent>()

export const themeEvent = emitter;

export function useTheme() {
    const [theme, setTheme] = useLocalStorageState<string>('launcher-theme', {defaultValue: light,},);
    const changeTheme = (theme: Theme) => {
        emitter.emit('changeTheme', theme);
    };

    return {
        changeTheme,
        themeEvent,
        theme,
        setTheme
    };
}
