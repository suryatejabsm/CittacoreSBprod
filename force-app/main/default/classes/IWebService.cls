public interface IWebService{
	IWebService setParams(Map<String,String> params);
	IWebService execute();
	IWebService validate();
	Object getResult();
}