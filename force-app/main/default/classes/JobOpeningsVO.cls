public class JobOpeningsVO {
    
    public String id { get; set; }
    public String jobTitle { get; set; }
    public String jobDescription { get; set; }
    public String jobType { get; set; }
    //public Boolean applied { get; set; }
    public String jobStatus { get; set; }
    public String Technology { get; set; }
    public String jobLocation { get; set; }
    public Decimal AvailableVacancies { get; set; }
    public String Experience { get; set; }


    public class JobOpening {
    public Integer totalCount { get; set; }
    public Integer currentPage { get; set; }
    public Integer displaylimit { get; set; }
    public List<JobOpeningsVO> jobOpenings { get; set; }
    
            }
}