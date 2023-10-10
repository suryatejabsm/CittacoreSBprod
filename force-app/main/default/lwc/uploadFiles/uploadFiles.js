import { LightningElement, track, api, wire } from 'lwc';
import uploadFile1 from '@salesforce/apex/AccViewContlr.uploadFile1';
// import sendEmailToHR from '@salesforce/apex/AccountViewController.sendEmailToHR';
import getEducation from '@salesforce/apex/AccountViewController.getEducation';
import fetchFiles from '@salesforce/apex/AccViewContlr.fetchFiles';


// Define the columns for the data table
const columns = [
    { label: 'File Name', fieldName: 'Name' },
    {
        label: 'Actions',
        type: 'button-icon',
        initialWidth: 100,
        typeAttributes: {
            iconName: 'utility:delete',
            title: 'Delete',
            variant: 'bare',
            alternativeText: 'Delete',
            name: 'delete'
        }
    }
];


export default class UploadFiles extends LightningElement {

    hideTableHeader = true;
    showTable = false;

    // Expose the login email as an API property
    //@api email;
    @api email;
    @track showModal = false;
    @track filePreviewUrl;
    selectedValue = '';
    @track uploadedFiles = [];

    // Track the visibility of the spinner, file data, and other UI elements
    @track showSpinner = false;
    @track fileData;
    @track fileName;
    @track disableUploadButton = true;
    @track columns = columns;
    @track showDataTable = true;
    @track timeout = 3000;
    @track sticky = false;
    @track toggleDocs = false;
    @track toggleCheckbox = false;
    @track picklistOptions = [];
    @track lstAllFiles = []; // Assume lstAllFiles is an array of file objects
    @track showModal = false;
    @track error;
    @track filePreviewUrl = '';

    iframeLoaded = false;
    handleIframeLoad() {
        this.iframeLoaded = true;
    }

    previewHandler(event) {
        const fileId = event.target.dataset.id;
        console.log(fileId);
        const selectedFile = this.lstAllFiles.find(fileIterator => fileIterator.Id === fileId);
        if (selectedFile) {
            // Perform the file preview logic here using the selectedFile object
            console.log('Previewing file:', selectedFile);
            this.showModal = true;
            this.filePreviewUrl = selectedFile.VersionDataUrl; // Replace with the field API name that holds the file URL
            console.log('filePreviewUrl', this.filePreviewUrl);

        } else {
            console.error('File not found');
        }

        // this.lstAllFiles(fileId)
        //     .then((previewUrl) => {
        //         this.filePreviewUrl = previewUrl;
        //         console.log("preview:" + this.filePreviewUrl);
        //         this.showModal = true;
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching file preview URL:', error);
        //     });
    }
    closeModal() {
        this.showModal = false;
    }
    // Track the selected picklist value and uploaded files

    connectedCallback() {
        this.getfiles();
    }

    getfiles() {
        fetchFiles({ email: this.email })
            .then(result => {
                console.log('lst:' + JSON.stringify(result));
                this.lstAllFiles = result;
                console.log('lst1:' + this.lstAllFiles);
                this.error = undefined;
            }).catch(error => {
                // this.lstAllFiles = undefined;
                this.error = error;
            })
    }
    //   @wire(fetchFiles, { email: '$email' })
    // wiredEmployee({ error, data }) {
    //     if (data) {
    //         this.lstAllFiles = data;
    //         console.log('lst:'+JSON.stringify(this.lstAllFiles));
    //     } else if (error) {
    //         console.error(error);
    //     }
    // }
    // Define the accepted file formats
    acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg', '.docx'];

    // Event handler for picklist change
    handlePicklistChange(event) {
        this.selectedValue = event.detail.value;
        this.disableUploadButton = false;
    }
    @wire(getEducation)
    wiredEduOptions({ error, data }) {
        if (data) {
            // Map the picklist values to options array
            console.log("picklist:" + data);
            this.picklistOptions = data.map(item => ({ label: item, value: item }));
            console.log('options ' + JSON.stringify(this.picklistOptions));
        } else if (error) {
            console.error('Error retrieving technology picklist values:', error);
        }
    }


    // Event handler for checkbox change
    handleChange(event) {
        // this.isDisabled = !event.target.checked;
        // if (!this.isDisabled) {
        //     this.toggleDocs = true;
        //     this.template.querySelector('[data-id="containerDiv"]').classList.add('slds-hide');
        // } else {
        //     this.toggleDocs = false;
        //     this.template.querySelector('[data-id="containerDiv"]').classList.remove('slds-hide');
        // }
    }

    // Event handler for file change
    handleFileChange(event) {
        // Clear the value of the file input field to allow selecting the same file again
        event.target.value = '';
        // Disable the upload button until new files are selected
        this.disableUploadButton = true;

        // Check if any files are selected
        if (event.target.files.length > 0) {
            // Iterate over each selected file
            Array.from(event.target.files).forEach(file => {
                // Get the file extension
                const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

                // Check if the file format is in the accepted formats array
                if (this.acceptedFormats.includes(fileExtension)) {
                    // Create a new FileReader object to read the file content
                    const reader = new FileReader();
                    // Define the onload callback function which is triggered when the file is read
                    reader.onload = () => {
                        // Extract the base64 encoded content of the file
                        const base64 = reader.result.split(',')[1];
                        // Get the original file name
                        const fileName = file.name;
                        // Get the selected value from the picklist (file type)
                        const fileType = this.selectedValue;
                        // Create the final file name by combining the file type and original file name
                        const finalFileName = `${fileType}_${fileName}`;
                        // Prepare the file data object with the necessary information
                        const fileData = {
                            filename: finalFileName,
                            base64: base64,
                            email: this.email
                        };
                        // Update the uploadedFiles array with the new file data
                        this.updateUploadedFilesTable(file, fileData);
                    };
                    // Read the file as a data URL (base64 encoded)
                    reader.readAsDataURL(file);
                } else {
                    // Show an error toast message for invalid file format
                    this.showToastMessage("error", "Invalid file format: " + fileExtension);
                    this.disableUploadButton = false;
                }
            });
        }
    }



    // Async function to upload files

    async uploadFile() {
        // Initialize a flag to determine if an email notification should be sent
        let sendEmail = false;
        // Get the login email from the component's property
        const email = this.email;
        console.log(email);
        // Show the spinner to indicate that file upload is in progress
        this.handleSpinner();

        // Create an array of promises for each file to be uploaded
        const uploadPromises = this.uploadedFiles.map(file => {
            return this.uploadSingleFile(file);
        });

        try {
            // Wait for all upload promises to resolve
            const results = await Promise.all(uploadPromises);

            // Process the upload results
            const filenames = this.processUploadResults(results, email);

            // Clear the file data and update the record view
            this.clearFileData();
            this.updateRecordView();

            // Clear the uploadedFiles array and disable the upload button
            this.clearUploadedFiles();
            this.disableUploadButton = true;

            // Show or hide the data table based on the selected value
            this.showDataTable = this.selectedValue !== null;

            // Show a success toast message with the uploaded file names
            this.showToastMessage("success", "Files uploaded successfully:\n" + filenames.join("\n"));
            this.showTable = true;
            this.connectedCallback();
            this.dispatchEvent(new CustomEvent('filesuploaded')); // Trigger custom event for parent component refresh
            if (sendEmail) {
                // Send an email notification to HR with the filenames and login email
                await this.sendEmailNotificationToHR(filenames, email);
            }
        } catch (error) {
            console.error('Error occurred during file upload:', error);
            // Show an error toast message
            this.showToastMessage("error", error);
        } finally {
            // Hide the spinner as the file upload process is complete
            this.handleSpinner();
        }
    }
    //The uploadSingleFile function is responsible for uploading a single file.
    async uploadSingleFile(file) {
        try {
            // Uploads a single file using the `uploadFile1` function and awaits the result
            const result = await uploadFile1({ base64: file.base64, filename: file.filename, email: file.email });

            // Returns an object with the filename and upload result
            return { filename: file.filename, uploadResult: result };
        } catch (error) {
            console.error('Error occurred while uploading ' + file.filename + ': ' + JSON.stringify(error));

            // Shows an error toast message using the `showToastMessage` function
            this.showToastMessage("error", JSON.stringify(error));

            // Returns an object with the filename and null upload result
            return { filename: file.filename, uploadResult: null };
        }
    }

    //The processUploadResults function is responsible for processing the upload results obtained 
    //from uploading multiple files
    processUploadResults(results, email) {
        console.log('results', results);
        let sendEmail = false;
        const filenames = [];

        results.forEach(uploadData => {
            const { filename, uploadResult } = uploadData;

            // Logs the filename and upload result for debugging purposes
            console.log('Filename:', filename);
            console.log('Upload Result:', uploadResult);

            if (uploadResult) {
                // Sets the flag to send an email notification
                sendEmail = true;
            } else {
                // Shows an error toast message using the `showToastMessage` function
                this.showToastMessage("error", "Error occurred while uploading.");
                console.error('Error occurred while uploading ' + filename);
            }

            // Pushes the filename into the `filenames` array
            filenames.push(filename);
        });

        // Returns an array of filenames
        return filenames;
    }


    clearFileData() {
        // Clears the file data by setting it to null
        this.fileData = null;
    }


    clearUploadedFiles() {
        // Clears the uploaded files array by assigning an empty array to it
        this.uploadedFiles = [];
    }

    showToastMessage(type, message) {
        const toastComponent = this.template.querySelector("c-custom-toast-messages");
        toastComponent.showToast(type, message);
    }


    // Function to send an email notification to HR
    async sendEmailNotificationToHR(filenames, email) {
        // Call the Apex method "sendEmailToHR" and pass the filenames and email as parameters
        sendEmailToHR({ filename: JSON.stringify(filenames), email: email })
            .then((result) => {
                // Handle the success response from the Apex method
                console.log(result);
            })
            .catch(error => {
                // Handle any errors that occurred during the Apex method call
                console.error('Failed to send email to HR:', JSON.stringify(error));
            });
    }



    // Function to handle spinner visibility
    handleSpinner() {
        this.showSpinner = !this.showSpinner;
    }

    // Function to update the record view after file upload
    updateRecordView() {
        setTimeout(() => {
            const refreshViewEvent = new CustomEvent('refreshview');
            this.dispatchEvent(refreshViewEvent);
        }, 1000);
    }

    // Function to update the uploaded files table
    updateUploadedFilesTable(file, fileData) {
        // Get the selected file type from the component's property
        const fileType = this.selectedValue;

        // Find the corresponding option label for the selected file type
        const selectedOption = this.picklistOptions.find(option => option.value === fileType);

        // Get the label for the selected file type, or an empty string if not found
        const fileTypeLabel = selectedOption ? selectedOption.label : '';

        // Create a new file name by combining the file type label and the original file name
        const fileName = `${fileTypeLabel}_${file.name}`;

        // Add the new file entry to the uploadedFiles array
        this.uploadedFiles = [
            ...this.uploadedFiles,
            {
                Name: fileName,
                FileType: fileType,
                ContentSize: file.size,
                ...fileData
            }
        ];

        // Remove the selected file type from the picklist options
        this.picklistOptions = this.picklistOptions.filter(option => option.value !== fileType);
    }


    // Function to check if there are uploaded files
    get hasUploadedFiles() {
        return this.uploadedFiles.length > 0;
    }

    // Function to handle row action (delete button) in the uploaded files table
    handleRowAction(event) {
        // Extracts the action and row information from the event detail
        const action = event.detail.action;
        const row = event.detail.row;
        if (action.name === 'delete') {
            // Checks if the action name is 'delete'
            // and calls the deleteFile function passing the file name from the row
            this.deleteFile(row.Name);
        }
    }

    // Function to delete a file from the uploaded files
    deleteFile(fileName) {
        // Find the index of the file with the specified file name in the uploadedFiles array
        const index = this.uploadedFiles.findIndex(file => file.Name === fileName);

        // Check if the file was found in the array
        if (index !== -1) {
            // Remove the file from the uploadedFiles array and retrieve the deleted file
            const deletedFile = this.uploadedFiles.splice(index, 1)[0];

            // Update the uploadedFiles array by creating a new array with the remaining files
            this.uploadedFiles = [...this.uploadedFiles];

            // Reset the fileName and fileData properties to null
            this.fileName = null;
            this.fileData = null;

            // Retrieve the file type of the deleted file
            const fileType = deletedFile.FileType;

            // Check if the file type exists in the picklist options
            const fileTypeExists = this.picklistOptions.some(option => option.value === fileType);

            // If the file type does not exist in the picklist options, add it back
            if (!fileTypeExists) {
                this.picklistOptions = [...this.picklistOptions, { label: fileType, value: fileType }];
            }
        }

        // Check if there are still uploaded files remaining
        if (this.uploadedFiles.length > 0) {
            // Enable the upload button since there are remaining files
            this.disableUploadButton = false;
        } else {
            // Disable the upload button and reset the selectedValue when no files are uploaded
            this.disableUploadButton = true;
            this.selectedValue = null;
        }
    }
    handleDeleteClick(event) {
        const fileName = event.target.dataset.fileName; // Get the file name from the dataset
        this.deleteFile(fileName); // Call the deleteFile function with the file name
    }


}