/**
 * Created by jakub on 2/9/17.
 */

export default class Actions {
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
        console.log( "*** API CALL ALLOCATE FIELD " + fieldName )
       // return this.toolbox.getManager().doGet(`/ui/field/allocate/${customerId}/${parentAssetId}/${fieldName}`);

        return new Promise(function(resolve, reject){
            resolve("1.1.1.1");
        });
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
        console.log( "*** API CALL RELEASE FIELD " + fieldName )
       // return this.toolbox.getManager().doDelete(`/ui/field/release/${customerId}/${parentAssetId}/${fieldName}`);

        return new Promise(function(resolve, reject){
            resolve("");
        });
    }

    /*

     */
    updateCPE() {
        console.log( "*** API CALL UPDATE CPE" )
    }

    /*

     */
    updateSD_WAN() {
        console.log( "*** API CALL UPDATE SD-WAN" )
    }
}