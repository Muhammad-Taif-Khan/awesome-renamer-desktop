import { getItem, setItem } from "./localStorage";

export function setInvalidCharsSetting(option: 'escape' | 'error'): void {
    setItem('invalidChars', option);
}

export function getInvalidCharsSetting (): 'escape' | 'error' | undefined {
    const data = getItem<'escape' | 'error'>('invalidChars');
    if(!data) return undefined;
    return data;
}
