declare global {
    namespace Stage.Types {
        type WithOptionalProperties<T, OptionalProperties extends keyof T> = Omit<T, OptionalProperties> &
            Partial<Pick<T, OptionalProperties>>;
    }
}

export type ObjectKeys<T extends Record<string, any>> = T[keyof T];

export type CancelablePromise<T> = {
    promise: Promise<T>;
    cancel: () => void;
};

export {};
