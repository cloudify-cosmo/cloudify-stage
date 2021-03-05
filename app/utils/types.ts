export type WithOptionalProperties<T, OptionalProperties extends keyof T> = Omit<T, OptionalProperties> &
    Partial<Pick<T, OptionalProperties>>;
