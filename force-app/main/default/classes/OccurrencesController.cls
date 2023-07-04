public class OccurrencesController {
    public Id classId { get; set; }
    public List<Occurrence__c> occurrences { get; set; }
    private Id enrollmentId;

    public OccurrencesController() {
        classId = null;
        occurrences = new List<Occurrence__c>();
    }

    public Id getEnrollmentId() {
        return this.enrollmentId;
    }

    public void setEnrollmentId(Id value) {
        this.enrollmentId = value;
        fetchData();
    }

    public void fetchData() {
        System.debug('@@ Enrollment ID ' + enrollmentId);

        if (enrollmentId != null) {
            List<Enrollment__c> enrollmentList = [SELECT Class__c FROM Enrollment__c WHERE Id = :enrollmentId];
            System.debug('@@enrollmentList ' + enrollmentList);

            if (!enrollmentList.isEmpty()) {
                classId = enrollmentList[0].Class__c;
                System.debug('@@classId ' + classId);

                List<Occurrence__c> queriedOccurrences = [SELECT Date__c, Individual_Lesson_Status__c FROM Occurrence__c WHERE Class__c = :classId];
                System.debug('@@queriedOccurrences ' + queriedOccurrences);

                if (!queriedOccurrences.isEmpty()) {
                    occurrences.addAll(queriedOccurrences);
                }
            }
        }
    }
}