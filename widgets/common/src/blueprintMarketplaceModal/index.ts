import BlueprintMarketplaceModal from './BlueprintMarketplaceModal';

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { BlueprintMarketplaceModal };
    }
}

Stage.defineCommon({
    name: 'BlueprintMarketplaceModal',
    common: React.memo(BlueprintMarketplaceModal, _.isEqual)
});
