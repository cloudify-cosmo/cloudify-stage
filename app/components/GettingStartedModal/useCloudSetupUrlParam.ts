import useSearchParam from '../../utils/hooks/useSearchParam';

const cloudSetupParameterName = 'cloudSetup';
const cloudSetupParameterValue = 'true';

export default function useCloudSetupUrlParam(): [boolean, () => void] {
    const [cloudSetupParameter, , deleteCloudSetupParameter] = useSearchParam(cloudSetupParameterName);

    return [cloudSetupParameter === cloudSetupParameterValue, deleteCloudSetupParameter];
}
