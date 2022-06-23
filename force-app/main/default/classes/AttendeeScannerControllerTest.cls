/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 06-23-2022
 * @last modified by  : ErickSixto
 **/
@isTest
private class AttendeeScannerControllerTest {
  @isTest
  private static void getCampaingTest() {
    Campaign cam = new Campaign();
    cam.Name = 'Test Camp';
    insert cam;
    // Actual test
    Test.startTest();
    Campaign camp = AttendeeScannerController.getCampaing(cam.Id);
    Test.stopTest();
  }
  @isTest
  private static void getContactTest() {
    Contact con = new Contact();
    con.LastName = 'Test Con';
    insert con;
    // Actual test
    Test.startTest();
    Contact cont = AttendeeScannerController.getContact(con.Id);
    Test.stopTest();
  }
  @isTest
  private static void createCampaignMemberTest() {
    Campaign cam = new Campaign();
    cam.Name = 'Test Camp';
    insert cam;
    Contact con = new Contact();
    con.LastName = 'Test Con';
    insert con;
    Test.startTest();
    AttendeeScannerController.createCampaignMember(cam.id, con.id);
    Test.stopTest();
  }
}
