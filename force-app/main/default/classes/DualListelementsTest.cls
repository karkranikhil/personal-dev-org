@isTest
private class DualListelementsTest {
  @isTest
  private static void testTestCase() {
    // Test data setup

    // Actual test
    Test.startTest();
    DualListElements element = new DualListElements();
    String label = element.Label;
    String value =element.Value;
    String icon = element.IconName;
    String tooltip =element.Tooltip;
    Boolean disabled = element.Disabled;
    Test.stopTest();

    // Asserts
  }
}
