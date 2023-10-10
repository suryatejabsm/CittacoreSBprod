public class ObjectRecogResponse {
 public Response[] responses;
    public Class Response {
        public LocalizedObjectAnnotation[] localizedObjectAnnotations;
    }
    public class LocalizedObjectAnnotation {
        public String mid;
        public String name;
        public Double score;
        public BoundingPoly boundingPoly;
    }
    public class BoundingPoly {
        public NormalizedVertice[] normalizedVertices;
    }
    public class NormalizedVertice {
        public Double x;
        public Double y;
    }
    public static ObjectRecogResponse parse(String json){
        return (ObjectRecogResponse) System.JSON.deserialize(json, ObjectRecogResponse.class);
    }
}