global class validateEmailUtility {
    // Helper method to validate email format for specific domains
    global static Boolean isValidEmail(String email) {
       String emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
        return Pattern.matches(emailRegex, email);
    }
}