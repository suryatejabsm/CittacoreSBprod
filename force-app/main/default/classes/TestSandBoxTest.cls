@isTest
public class TestSandBoxTest 
{
	@isTest
    public static void testName(){
        String testString = TestSandbox.HelloWorld();
        System.assertEquals('hi world', testString);
    }
}