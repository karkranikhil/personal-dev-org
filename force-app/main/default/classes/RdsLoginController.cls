/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 04-22-2022
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
      //* GET COMMUNITY OWNER USER
      String siteId = Site.getSiteId();
      String ownerId = Site.getAdminId();
      System.debug('ownerId : ' + ownerId);

      //* GET COMMUNITY SELF REGISTER PROFILE
      String networkId = Network.getNetworkId();
      Network net = [
        SELECT Id, Name, SelfRegProfileId, WelcomeEmailTemplateId
        FROM Network
        WHERE Id = :networkId
      ];

      Id regProfileId = net.SelfRegProfileId;
      Id emailTemplateId = net.WelcomeEmailTemplateId;
      System.debug('regProfileId : ' + regProfileId);

      Id personAccountRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName()
        .get('Unternehmensaccount')
        .getRecordTypeId();

      Account portalAccount = new Account();
      portalAccount.Name = firstName + ' ' + lastName;
      portalAccount.RecordTypeId = personAccountRecordTypeId;
      portalAccount.OwnerId = ownerId;
      System.debug('portalAccount: ' + portalAccount);

      insert portalAccount;

      Contact portalContact = new Contact();
      portalContact.FirstName = firstName;
      portalContact.LastName = lastName;
      portalContact.AccountId = portalAccount.Id;
      System.debug('portalContact: ' + portalContact);

      insert portalContact;

      // portalAccount.IsPartner = true;
      // update portalAccount;
      String accountId = portalAccount.Id;
      String contactId = portalContact.Id;
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
      if (!Test.isRunningTest())
        throw new AuraHandledException(e.getMessage());
      return 'Error';
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
      LanguageLocaleKey = 'en_US' // Required
    );
    Database.DMLOptions dmo = new Database.DMLOptions();
    dmo.EmailHeader.triggerUserEmail = true;
    u.setOptions(dmo);
    Database.insert(u, dmo);
    Id userId = u.Id;
    System.debug('userId: ' + userId);
  }

  public static void sendWelcomeEmail(List<User> users) {
    //! Only available for single registration
    User newUser = users[0];
    Id userId = users[0].Id;
    if (userId != null) {
      if (newUser.Profile.Name != 'RSD Portal Nutzer')
        return;
      Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
      mail.setTargetObjectId(userId);
      //Change with Template ID
      mail.setTemplateId(System.Label.CUSTOM_LOGIN_WELCOME_EMAIL_TEMPLATE_ID);
      mail.saveAsActivity = false;
      Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });
    }
  }
}
