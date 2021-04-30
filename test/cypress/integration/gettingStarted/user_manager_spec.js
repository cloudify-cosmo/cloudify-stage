// describe('Getting started flag in user management widget', () => {
//     before(() => {
//         // let showGettingStarted = false;
//         // cy.interceptSp('GET', `/users/admin`, req => {
//         //     req.reply({ show_getting_started: showGettingStarted });
//         // }).as('userAdmin');
//         // cy.interceptSp('POST', `/users/admin`, req => {
//         //     showGettingStarted = req.body.show_getting_started;
//         //     req.reply({ show_getting_started: showGettingStarted });
//         // });
//         cy.activate().usePageMock('userManagement').mockLogin(undefined, undefined, true);
//     });

//     it('should allow to enable and disable modal', () => {
//         cy.log('Use admin user');

//         cy.contains('tr', 'admin').within(() => {
//             cy.log('Disable modal');
//             cy.get('td:eq(4)').within(() => {
//                 cy.get('.checkbox').click();
//                 // cy.get('.checkbox.checked').click();
//                 cy.get('.checkbox.checked').as('userAdmin');
//             });
//         });

//         cy.wait('@userAdmin').refreshPage(false).get('label').contains('has.text', "Don't show next time").click();
//     });
// });
