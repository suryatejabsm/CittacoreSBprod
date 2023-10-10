public class ObjectRecogRequest {
public list<request> requests{get;set;}
    
	public class request{
		public image image{get;set;}
		public list<feature> features{get;set;}
	}
	public class image{
		public Blob content{get;set;}
	}
	public class feature{
		public String type{get;set;}
        public integer maxResults{get;set;}
	}
}