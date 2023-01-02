/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 01-02-2023
 * @last modified by  : ErickSixto
 **/
public with sharing class EmailUtils {
  @AuraEnabled
  public static void sendEmail(String name, String mail, String message) {
    // Set the email addresses for the To, CC, and BCC fields.
    String[] toAddresses = new List<String>{ 'sixto.developer@gmail.com' };

    // Create a new email message.
    Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();

    // Set the email addresses for the To, CC, and BCC fields.
    email.setToAddresses(toAddresses);

    // Set the subject and body of the email.
    email.setSubject('Message from website');
    email.setPlainTextBody(
      'Name: ' +
      name +
      '\nEmail: ' +
      mail +
      '\n\n' +
      message
    );

    // Set the name of the sender.
    email.setSenderDisplayName(name);

    // Send the email.
    Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ email });
  }
}
