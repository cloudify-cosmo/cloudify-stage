declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Stage.Types {
        type WithOptionalProperties<T, OptionalProperties extends keyof T> = Omit<T, OptionalProperties> &
            Partial<Pick<T, OptionalProperties>>;
    }
}

export {};
