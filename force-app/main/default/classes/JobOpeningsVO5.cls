global class JobOpeningsVO5 {
        public string id { get; set; }
        public String jobTitle { get; set; }
        public String jobDescription { get; set; }
        public String jobType { get; set; }
        public string jobStatus { get; set; }
        public string Technology { get; set; }
        public string jobLocation { get; set; }
        public decimal AvailableVacancies { get; set; }
        public string Experience { get; set; }
    public class JobOpening {
    public Integer totalRecords { get; set; }
    public Integer page { get; set; }
    public Integer size { get; set; }
    public List<JobOpeningsVO5> jobOpenings { get; set; }
    }
    }