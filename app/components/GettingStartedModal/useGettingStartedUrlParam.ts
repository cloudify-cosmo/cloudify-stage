import useSearchParam from '../../utils/hooks/useSearchParam';

const gettingStartedParameterName = 'gettingStarted';
const gettingStartedParameterValue = 'true';

export default function useGettingStartedUrlParam(): [boolean, () => void] {
    const [gettingStartedParameter, , deleteGettingStartedParameter] = useSearchParam(gettingStartedParameterName);

    return [gettingStartedParameter === gettingStartedParameterValue, deleteGettingStartedParameter];
}
