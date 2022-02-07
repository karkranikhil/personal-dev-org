/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 02-06-2022
 * @last modified by  : ErickSixto
 **/
@isTest(isParallel = true)
public class esLookupControllerTest{
    @isTest
    static void search_should_return_Account(){
        List<Id> fixedResults = new Id[1];
        Account account = createAccount('Account');
        fixedResults.add(account.Id);
        Test.setFixedSearchResults(fixedResults);
        List<String> selectedIds = new List<String>();
        List<LookupSearchResult> results = esLookupController.search('Acc', selectedIds, 'Account');

        System.assertEquals(1, results.size());
        System.assertEquals(account.Id, results.get(0).getId());
    }

    @isTest
    static void search_should_return_Account_by_Name(){
        List<Id> fixedResults = new Id[1];
        Account account = createAccount('TEST');
        fixedResults.add(account.Id);
        Test.setFixedSearchResults(fixedResults);
        List<String> selectedIds = new List<String>();
        LookupSearchResult result = esLookupController.searchWithUniqueField('Name', 'TEST', 'Account');
        System.assertEquals(account.Id, result.getId());
    }

    @isTest
    static void getRecentlyViewedTest(){
        List<Id> fixedResults = new Id[1];
        Account acc = createAccount('Account1');
        Account record = [SELECT Id
                          FROM Account
                          FOR  VIEW ];
        fixedResults.add(acc.Id);
        Test.setFixedSearchResults(fixedResults);
        List<LookupSearchResult> results = esLookupController.getRecentlyViewed('Account');
        System.assertEquals(acc.Id, results.get(0).getId());
    }

    @isTest
    static void getObjectOptionsTest(){

        List<LookupSearchResult> results = esLookupController.getObjectOptions('Account');
        System.assert(results.size() > 0, 'At least one option should have been returned');
    }

    private static Account createAccount(String name){
        Account account = new Account(Name = name);
        insert account;
        return account;
    }

}