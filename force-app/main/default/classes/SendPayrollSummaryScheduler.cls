global class SendPayrollSummaryScheduler implements Schedulable{
    global void execute(SchedulableContext sc){
        ExpenditureEmailBatch batch = new ExpenditureEmailBatch();
        Database.executeBatch(batch);
    }

}