import { GettingStartedSecretsData, GettingStartedTechnologiesData } from './model';

const countTrueProperties = (data: Record<string, boolean | undefined>) =>
    Object.values(data).reduce((count, value) => (value ? count + 1 : count), 0);

const countEmptyProperties = (data: Record<string, string | undefined>) =>
    Object.values(data).reduce((count, value) => (value ? count : count + 1), 0);

export const validateTechnologyFields = (data: GettingStartedTechnologiesData) => {
    const errors: string[] = [];
    if (!countTrueProperties(data)) {
        errors.push('Please select some technology.');
    }
    return errors;
};

export const validateSecretFields = (data: GettingStartedSecretsData) => {
    const errors: string[] = [];
    if (countEmptyProperties(data)) {
        errors.push('Please fill all fields.');
    }
    return errors;
};
