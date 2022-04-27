/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 04-27-2022
 * @last modified by  : ErickSixto
 **/
@isTest
private class RdsLoginControllerTest {
  @TestSetup
  static void makeData() {
    UserRole portalRole = [
      SELECT Id
      FROM UserRole
      WHERE PortalType = 'None'
      LIMIT 1
    ];
    system.debug('portalRole is ' + portalRole);

    Profile profile1 = [
      SELECT Id
      FROM Profile
      WHERE name = 'System Administrator'
    ];
    User portalAccountOwner1 = new User(
      UserRoleId = portalRole.Id,
      ProfileId = profile1.Id,
      Username = System.now().millisecond() + 'test2@test.com',
      Alias = 'batman',
      Email = 'bruce.wayne@wayneenterprises.com',
      EmailEncodingKey = 'UTF-8',
      Firstname = 'Bruce',
      Lastname = 'Wayne',
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US',
      TimeZoneSidKey = 'America/Chicago'
    );
    Database.insert(portalAccountOwner1);

    EmailTemplate validEmailTemplate = new EmailTemplate();
    validEmailTemplate.isActive = true;
    validEmailTemplate.Name = 'name';
    validEmailTemplate.DeveloperName = 'testTemplate';
    validEmailTemplate.TemplateType = 'text';
    validEmailTemplate.FolderId = UserInfo.getUserId();

    insert validEmailTemplate;

    System.runAs(portalAccountOwner1) {
      //Create account
      Account portalAccount1 = new Account(
        Name = 'TestAccount',
        OwnerId = portalAccountOwner1.Id
      );
      Database.insert(portalAccount1);

      //Create contact
      Contact contact1 = new Contact(
        FirstName = 'Test',
        Lastname = 'McTesty',
        AccountId = portalAccount1.Id,
        Email = System.now().millisecond() + 'test@test.com'
      );
      Database.insert(contact1);

      //Create user
      Profile portalProfile = [
        SELECT Id
        FROM Profile
        WHERE UserType = 'PowerCustomerSuccess'
        LIMIT 1
      ];
      User user1 = new User(
        Username = System.now().millisecond() + 'test12345@test.com',
        ContactId = contact1.Id,
        ProfileId = portalProfile.Id,
        Alias = 'test123',
        Email = 'test12345@test.com',
        EmailEncodingKey = 'UTF-8',
        LastName = 'McTesty',
        CommunityNickname = 'test12345',
        TimeZoneSidKey = 'America/Los_Angeles',
        LocaleSidKey = 'en_US',
        LanguageLocaleKey = 'en_US'
      );
      Database.insert(user1);
    }
  }

  @isTest
  private static void loginTest() {
    // Test data setup

    // Actual test
    Test.startTest();
    try {
      String pageUrl = RdsLoginController.login(
        'email@test.com',
        'password',
        ''
      );
    } catch (Exception e) {
      System.assertEquals('Script-thrown exception', e.getMessage());
    }
    Test.stopTest();

    // Asserts
  }
  @isTest
  private static void registerUserTest() {
    // Test data setup

    // Actual test
    Test.startTest();
    try {
      String pageUrl = RdsLoginController.registerUser(
        'First',
        'Last',
        '',
        'portalUser@rdsportal.com',
        'password'
      );
    } catch (Exception e) {
      System.assertEquals('', e.getMessage());
    }
    Test.stopTest();

    // Asserts
  }
  @isTest
  private static void resetPasswordTest() {
    // Test data setup

    // Actual test
    Test.startTest();
    try {
      Boolean reseted = RdsLoginController.resetPassword('success@test.com');
    } catch (Exception e) {
      System.assertEquals('Error Test', e.getMessage());
    }
    Test.stopTest();

    // Asserts
  }
  @isTest
  private static void isEmailExistTest() {
    // Test data setup
    User existing = [SELECT Id, Email FROM User WHERE LastName = 'McTesty'];
    // Actual test
    Test.startTest();
    Boolean doExist = RdsLoginController.isEmailExist(existing.Email);
    Boolean doNotExist = RdsLoginController.isEmailExist(
      'another@rdstester.com'
    );
    Test.stopTest();
  }
}
