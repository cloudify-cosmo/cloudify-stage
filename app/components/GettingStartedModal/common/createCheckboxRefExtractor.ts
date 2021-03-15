import type { MutableRefObject, Ref } from 'react';

/**
 * Creates function that lets to extract semantic-ui-react checkbox input reference.
 * e.g.
 *   const inputRef = useRef<HTMLInputElement | null>(null);
 *   <SemanticRef innerRef={createCheckboxRefExtractor(inputRef)}>
 *     <Form.Checkbox name="someName" label="Checkbox name" checked={true} onChange={handleChange} />
 *   </SemanticRef>
 * @param inputRef extracted input reference.
 */
const createCheckboxRefExtractor = (inputRef: MutableRefObject<HTMLInputElement | null>): Ref<HTMLElement> => {
    return (ref: HTMLElement) => {
        if (ref) {
            inputRef.current = ref.firstChild as HTMLInputElement;
        } else {
            inputRef.current = null;
        }
    };
};

export default createCheckboxRefExtractor;
