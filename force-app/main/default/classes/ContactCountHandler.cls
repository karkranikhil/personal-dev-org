public class ContactCountHandler{
    public static void handleIncrease(List<Contact> contacts){
        List<Account> accounts = getRelatedAccounts(contacts);
        for (Account acc : accounts){
            acc.Name = 'Yes I am A different Name';
        }
        update accounts;
        if (accounts.size() > 0){
            increaseCount(accounts);
        }
    }

    public static void handleDecrease(List<Contact> contacts){
        List<Account> accounts = getRelatedAccounts(contacts);
        if (accounts.size() > 0){
            decreaseCount(accounts);
        }
    }

    private static List<Account> getRelatedAccounts(List<Contact> contacts){
        Set<Id> accountSetId = new Set<Id>();

        for (Contact con : contacts){
            accountSetId.add(con.AccountId);
        }
        List<Account> accountList = [SELECT Id, Count_Of_Contact__c
                                     FROM Account
                                     WHERE Id IN :accountSetId];
        return accountList;
    }

    private static void increaseCount(List<Account> accounts){
        for (Account acc : accounts){
            if (acc.Count_Of_Contact__c == null){
                acc.Count_Of_Contact__c = 1;
            } else{
                acc.Count_Of_Contact__c = acc.Count_Of_Contact__c + 1;
            }

            System.debug(acc.Count_Of_Contact__c);
        }

        update accounts;
    }

    private static void decreaseCount(List<Account> accounts){
        for (Account acc : accounts){
            if (acc.Count_Of_Contact__c == null){
                acc.Count_Of_Contact__c = 0;
            } else{
                acc.Count_Of_Contact__c = acc.Count_Of_Contact__c - 1;
            }
            System.debug(acc.Count_Of_Contact__c);
        }

        update accounts;
    }
}