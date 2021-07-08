public class AccountTriggerHelper{
	public static void reverseDescription(Account account, Account oldAccount){
		if (String.isNotBlank(account.Description)){
			account.Description = reverseStringWords(account.Description);
		}
        else {
            account.Description = oldAccount.Description;
        }
	}

	private static String reverseStringWords(String sentence){
		List<String> words = sentence.split(' ');
		List<String> reversedWords = new List<String>();

		for (Integer i = words.size()-1; i >= 0; i--){
			reversedWords.add(words.get(i));
		}

        
        String newSentence = reversedWords.toString().replace('(', '');
        newSentence = newSentence.replace(')', '');
        newSentence = newSentence.replace(',', '');

        return newSentence;

	}
}