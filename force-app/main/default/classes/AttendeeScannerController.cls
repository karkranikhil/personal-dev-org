/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 06-23-2022
 * @last modified by  : ErickSixto
 **/
public class AttendeeScannerController {
  @AuraEnabled
  public static Campaign getCampaing(Id recordId) {
    List<Campaign> campaigns = [
      SELECT Id, Name
      FROM Campaign
      WHERE Id = :recordId
    ];
    if (campaigns.size() < 1) {
      return null;
    }
    return campaigns[0];
  }

  @AuraEnabled
  public static Contact getContact(Id recordId) {
    List<Contact> contacts = [
      SELECT Id, Name
      FROM Contact
      WHERE Id = :recordId
    ];
    if (contacts.size() < 1) {
      return null;
    }
    System.debug('Contact: ' + contacts[0]);
    return contacts[0];
  }

  @AuraEnabled
  public static void createCampaignMember(Id campaignId, Id contactId) {
    try {
      System.debug('Campaign: ' + campaignId);
      System.debug('Contact: ' + contactId);
      CampaignMember member = new CampaignMember();
      member.CampaignId = campaignId;
      member.ContactId = contactId;
      insert member;
      System.debug('member: ' + member);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
