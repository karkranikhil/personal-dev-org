global class SendLessonConfirmationScheduler implements Schedulable {
    global void execute(SchedulableContext sc) {
        SendLessonConfirmationBatch batch = new SendLessonConfirmationBatch();
        Database.executeBatch(batch);
    }
}