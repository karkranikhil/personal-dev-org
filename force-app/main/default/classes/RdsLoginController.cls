/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 04-21-2022
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
      Id ownerId = [SELECT AdminId FROM Site WHERE id = :siteId]?.AdminId;
      System.debug('ownerId : ' + ownerId);

      //* GET COMMUNITY SELF REGISTER PROFILE
      String networkId = Network.getNetworkId();
      Id regProfileId = [
        SELECT Id, Name, SelfRegProfileId
        FROM Network
        WHERE Id = :networkId
      ]
      ?.SelfRegProfileId;
      System.debug('regProfileId : ' + regProfileId);

      String accountId;
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

      accountId = portalAccount.Id;
      System.debug('accountId: ' + accountId);

      String alias = username.substring(0, 7);
      String uniqueCommunityNickName =
        firstName.substring(0, 2) +
        lastName.substring(0, 2) +
        username;

      User u = createUser(
        portalContact.Id,
        email,
        firstName,
        lastName,
        userName,
        alias,
        uniqueCommunityNickName,
        regProfileId
      );
      String userId = Site.createPortalUser(u, accountId, password);
      System.debug('userId: ' + userId);
      if (userId != null) {
        if (password != null && password.length() > 1) {
          ApexPages.PageReference pageRef = Site.login(
            username,
            password,
            null
          );
          if (pageRef != null)
            return pageRef.getUrl();
        } else {
          ApexPages.PageReference page = System.Page.SiteRegisterConfirm;
          page.setRedirect(true);
          return page.getUrl();
        }
      }

      return null;
    } catch (Exception e) {
      system.debug('e.getMessage+   ' + e.getMessage());
      if (!Test.isRunningTest())
        throw new AuraHandledException(e.getMessage());
      return null;
    }
  }

  public static User createUser(
    String contactId,
    String email,
    String firstName,
    String lastName,
    String userName,
    String userAlias,
    String nickckname,
    String profileId
  ) {
    Database.DMLOptions dmo = new Database.DMLOptions();
    dmo.EmailHeader.triggerUserEmail = true;
    //take the first few characters of the username for the alias
    String alias = userName.substring(0, 7);
    User u = new User(
      contactId = contactId,
      firstName = firstName,
      lastname = lastname,
      email = email,
      alias = userAlias,
      username = username,
      communitynickname = nickckname,
      ProfileId = profileId,
      TimeZoneSidKey = 'America/Phoenix', // Required
      LocaleSidKey = 'en_US', // Required
      EmailEncodingKey = 'ISO-8859-1', // Required
      LanguageLocaleKey = 'en_US' // Required
    );

    u.setOptions(dmo);
    insert u;
    return u;
  }
}
