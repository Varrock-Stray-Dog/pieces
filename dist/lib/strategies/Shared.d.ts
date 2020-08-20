export declare type Arr = readonly unknown[];
export declare type Ctor<A extends Arr = readonly any[], R = any> = new (...args: A) => R;
export declare function isClass(value: unknown): value is Ctor;
export declare function classExtends<T extends Ctor>(value: Ctor, base: T): value is T;
//# sourceMappingURL=Shared.d.ts.map