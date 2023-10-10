public interface IWebServicev2 {
    IWebService setParams(Map<String, String> params);
    IWebService setPage(Integer page);
    IWebService setLimit(Integer displaylimit);
    IWebService execute();
    IWebService validate();
    Object getResult();

}