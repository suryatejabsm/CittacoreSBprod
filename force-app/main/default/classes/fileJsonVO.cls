public class fileJsonVO
 {
      public String fileName;
    public String base64;
    public static fileJsonVO parse(String json) {
		return (fileJsonVO) System.JSON.deserialize(json, fileJsonVO.class);
	}

}