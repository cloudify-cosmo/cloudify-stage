/**
 * Created by jakub on 2/9/17.
 */

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }


    /*
         GET verb to uri  /ui/field/allocate
         {
             {
                 customer_id,
                 Parent asset ID,  # If the field is for a CPE, then this is the  CPE asset ID,   if not  then it’s -1
                 field_name
             }
         }
      */
    allocateFromDataBase( customerId, parentAssetId, fieldName ) {
        return this.toolbox.getManager().doGet(`/ui/field/allocate/${customer_id}/${parentAssetId}/${fieldName}`);
    }

    /*
        DELETE verb to uri  /ui/field/release
         {
             {
                 customer_id,
                 Parent asset ID,  # If the field is for a CPE, then this is the  CPE asset ID,   if not  then it’s -1
                 field_name
             }
         }
     */
    releaseFromDataBase( customerId, parentAssetId, fieldName ) {
        return this.toolbox.getManager().doDelete(`/ui/field/release/${customer_id}/${parentAssetId}/${fieldName}`);
    }

    updateCPE() {

    }

    updateSD_WAN() {

    }
}