/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 04-27-2022
 * @last modified by  : ErickSixto
 **/
public without sharing class RdsLoginController {
  @AuraEnabled
  public static String login(String email, String password, String startUrl) {
    try {
      ApexPages.PageReference pageRef = Site.login(email, password, startUrl);
      if (pageRef != null)
        return pageRef.getUrl();
      throw new CalloutException();
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean resetPassword(String email) {
    try {
      return Site.forgotPassword(email);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean isEmailExist(String username) {
    try {
      List<User> userList = new List<User>();
      userList = [SELECT Id, Name FROM User WHERE Username = :username];
      return !userList.isEmpty();
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static string registerUser(
    String firstName,
    String lastName,
    String username,
    String email,
    String password
  ) {
    try {
      username = email; //! Set the user name to be the email
      if (isEmailExist(username)) {
        throw new AuraHandledException('Username already exists');
      }

      //* GET COMMUNITY OWNER USER
      String siteId = Site.getSiteId();

      String ownerId = !Test.isRunningTest()
        ? Site.getAdminId()
        : [SELECT Id FROM User WHERE LastName = 'Wayne'].Id;
      System.debug('ownerId : ' + ownerId);

      //* GET COMMUNITY SELF REGISTER PROFILE
      String networkId = Network.getNetworkId();
      Id regProfileId;
      Id emailTemplateId;
      if (!Test.isRunningTest()) {
        Network net = [
          SELECT Id, Name, SelfRegProfileId, WelcomeEmailTemplateId
          FROM Network
          WHERE Id = :networkId
        ];

        regProfileId = net.SelfRegProfileId;
        emailTemplateId = net.WelcomeEmailTemplateId;
      } else {
        regProfileId = [
          SELECT Id
          FROM Profile
          WHERE UserType = 'PowerCustomerSuccess'
          LIMIT 1
        ]
        .Id;

        emailTemplateId = [
          SELECT Id, DeveloperName
          FROM EmailTemplate
          WHERE DeveloperName = 'testTemplate'
        ]
        .Id;
      }
      System.debug('regProfileId : ' + regProfileId);

      Id personAccountRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName()
        .get('PersonAccount')
        .getRecordTypeId();

      Account portalAccount = new Account();
      portalAccount.FirstName = firstName;
      portalAccount.LastName = lastName;
      portalAccount.PersonEmail = email;
      portalAccount.RecordTypeId = personAccountRecordTypeId;
      portalAccount.OwnerId = ownerId;
      System.debug('portalAccount: ' + portalAccount);

      insert portalAccount;

      String accountId = portalAccount.Id;

      String contactId = [
        SELECT PersonContactId
        FROM Account
        WHERE Id = :accountId
      ]
      ?.PersonContactId;
      System.debug('contactId: ' + contactId);
      System.debug('accountId: ' + accountId);

      String alias = username.substring(0, 7);
      String uniqueCommunityNickName =
        firstName.substring(0, 2) +
        lastName.substring(0, 2) +
        string.valueOf(math.random()).substring(0, 6);

      String uAlias = userName.substring(0, 7);

      createCommunityUser(
        contactId,
        firstName,
        lastname,
        email,
        uAlias,
        username,
        uniqueCommunityNickName,
        regProfileId,
        password,
        ownerId,
        emailTemplateId
      );
      return 'Success';
    } catch (Exception e) {
      system.debug('e.getMessage+   ' + e.getMessage());
      throw new AuraHandledException(e.getMessage());
    }
  }

  @future
  public static void createCommunityUser(
    String contactId,
    String firstName,
    String lastname,
    String email,
    String uAlias,
    String username,
    String uniqueCommunityNickName,
    String regProfileId,
    String password,
    String ownerId,
    String emailTemplate
  ) {
    User u = new User(
      contactId = contactId,
      firstName = firstName,
      lastname = lastname,
      email = email,
      alias = uAlias,
      username = username,
      ProfileId = regProfileId,
      communitynickname = uniqueCommunityNickName,
      TimeZoneSidKey = 'America/Phoenix', // Required
      LocaleSidKey = 'en_US', // Required
      EmailEncodingKey = 'ISO-8859-1', // Required
      LanguageLocaleKey = 'en_US', // Required
      IsActive = true
    );
    Database.DMLOptions dmo = new Database.DMLOptions();
    dmo.EmailHeader.triggerUserEmail = true;
    u.setOptions(dmo);
    Database.insert(u, dmo);
    Id userId = u.Id;
    //System.setPassword(userId, password);
    //System.resetPassword(userId, true);
    System.debug('userId: ' + userId);
  }
}
