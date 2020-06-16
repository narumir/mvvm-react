import {Category} from "./Category";

export class CategoryH {
    private static readonly selects = new Map<string, ()=>void>();
    private static readonly removes = new Map<string, ()=>void>();

    static add({target, keyCode}: KeyboardEvent){
        const input = target as HTMLInputElement;
        if (!input.value.trim() || keyCode !== 13) return;
        Category.add(input.value.trim());
        input.value = "";
    }

    static select(key:string){
        const {selects} = CategoryH;
        if (!selects.has(key)) selects.set(key, ()=>Category.current = key);
        return selects.get(key)!!;
    }

    static remove(key:string){
        const {removes} = CategoryH;
        if (!removes.has(key)) removes.set(key, ()=>Category.remove(key));
        return removes.get(key)!!;
    }
}