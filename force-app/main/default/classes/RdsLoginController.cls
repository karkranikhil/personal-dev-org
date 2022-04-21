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
    String communityNickname,
    String password
  ) {
    try {
      Set<String> communityNicknameSet = new Set<String>();

      for (User usr : [
        SELECT Id, CommunityNickname
        FROM User
        WHERE CommunityNickname != NULL
      ]) {
        communityNicknameSet.add(usr.CommunityNickname);
      }

      String uniqueCommunityNickName;

      if (communityNicknameSet.isEmpty()) {
        if (communityNickname.length() > 4) {
          uniqueCommunityNickName =
            communityNickname.substring(0, 4) +
            String.valueOf(Integer.valueOf(Math.random() * 10000));
        } else {
          uniqueCommunityNickName =
            communityNickname +
            String.valueOf(Integer.valueOf(Math.random() * 10000));
        }
      } else {
        for (Integer i = 1; i <= 9999; i++) {
          if (communityNickname.length() > 4) {
            uniqueCommunityNickName =
              communityNickname.substring(0, 4) +
              String.valueOf(Integer.valueOf(Math.random() * 10000));
          } else {
            uniqueCommunityNickName =
              communityNickname +
              String.valueOf(Integer.valueOf(Math.random() * 10000));
          }

          if (!communityNicknameSet.contains(uniqueCommunityNickName)) {
            break;
          }
        }
      }

      User u = new User();
      u.firstName = firstName;
      u.lastName = lastName;
      u.Username = username;
      u.Email = email;
      u.CommunityNickname = uniqueCommunityNickName;

      String accountId;

      Account portalAccount = new Account();
      portalAccount.Name = firstName + ' ' + lastName;
      insert portalAccount;

      portalAccount.IsPartner = true;
      update portalAccount;

      accountId = portalAccount.Id;

      String userId = Site.createPortalUser(u, accountId, password);

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
}
