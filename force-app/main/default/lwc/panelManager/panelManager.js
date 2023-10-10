import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getPanels from '@salesforce/apex/PanelController.getPanels';
import createPanel from '@salesforce/apex/PanelController.createPanel';
import updatePanel from '@salesforce/apex/PanelController.updatePanel';
import deletePanel from '@salesforce/apex/PanelController.deletePanel';

export default class PanelManager extends LightningElement {
  @track panels;
  @track panelName = '';
  @track positionName = '';
  @track interviewer1 = '';
  @track interviewer2 = '';
  @track interviewer3 = '';
  @track selectedPanelId;
  @track showCreateEditModal = false;

  @wire(getPanels)
  wiredPanels(value) {
    const { error, data } = value;
    if (data) {
      this.panels = data;
      
      this.panels = data.map(record => {
        if (record.CEMS_Position_Name__r) {
            record = Object.assign(
                { "CEMS_Position_Name__r.Name": record.CEMS_Position_Name__r.Name },
                record
            );
        }
        if (record.CEMS_Interviewer_1__r) {
            record = Object.assign(
                { "CEMS_Interviewer_1__r.Name": record.CEMS_Interviewer_1__r.Name },
                record
            );
        }

        if (record.CEMS_Interviewer_2__r) {
            record = Object.assign(
                { "CEMS_Interviewer_2__r.Name": record.CEMS_Interviewer_2__r.Name },
                record
            );
        }

        if (record.CEMS_Interviewer_3__r) {
            record = Object.assign(
                { "CEMS_Interviewer_3__r.Name": record.CEMS_Interviewer_3__r.Name },
                record
            );
        }

      

        return record;
    });
    } else if (error) {
      console.error(error);
    }
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this[name] = value;
  }

  handleNewClick() {
    this.showCreateEditModal = true;
    this.resetFormFields();
  }

  handleEditClick(panelId) {
    this.showCreateEditModal = true;
    this.selectedPanelId = panelId;
    console.log('---------Inside Edit-------'+ this.selectedPanelId);
  
    const selectedPanel = this.panels.find(panel => panel.Id === this.selectedPanelId);
    if (selectedPanel) {
      this.panelName = selectedPanel.Name;
      this.positionName = selectedPanel.CEMS_Position_Name__r.Name;
      this.interviewer1 = selectedPanel.CEMS_Interviewer_1__r.Name;
      this.interviewer2 = selectedPanel.CEMS_Interviewer_2__r.Name;
      this.interviewer3 = selectedPanel.CEMS_Interviewer_3__r.Name;
    }
  }

  handleSave() {
    if (this.isFormValid()) {
      if (this.selectedPanelId) {
        // Update panel
        updatePanel({
          panelId: this.selectedPanelId,
          panelName: this.panelName,
          positionName: this.positionName,
          interviewer1: this.interviewer1,
          interviewer2: this.interviewer2,
          interviewer3: this.interviewer3
        })
          .then(() => {
            this.resetFormFields();
            this.showCreateEditModal = false;
            return refreshApex(this.wiredPanels);
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        // Create panel
        createPanel({
          panelName: this.panelName,
          positionName: this.positionName,
          interviewer1: this.interviewer1,
          interviewer2: this.interviewer2,
          interviewer3: this.interviewer3
        })
          .then(() => {
            this.resetFormFields();
            this.showCreateEditModal = false;
            return refreshApex(this.wiredPanels);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }

  handleDeleteClick(event) {
    const panelId = event.target.dataset.id;
    deletePanel({ panelId })
      .then(() => {
        return refreshApex(this.wiredPanels);
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleCancel() {
    this.resetFormFields();
    this.showCreateEditModal = false;
  }

  resetFormFields() {
    this.panelName = '';
    this.positionName = '';
    this.interviewer1 = '';
    this.interviewer2 = '';
    this.interviewer3 = '';
    this.selectedPanelId = null;
  }

  isFormValid() {
    // Add form validation logic if needed
    return true;
  }

  get columns() {
    return [
      { label: 'Panel Name', fieldName: 'Name', type: 'text' },
      { label: 'Position Name', fieldName: 'CEMS_Position_Name__r.Name', type: 'text' },
      { label: 'Interviewer 1', fieldName:       'CEMS_Interviewer_1__r.Name', type: 'text' },
      { label: 'Interviewer 2', fieldName: 'CEMS_Interviewer_2__r.Name', type: 'text' },
      { label: 'Interviewer 3', fieldName: 'CEMS_Interviewer_3__r.Name', type: 'text' },
      {
        type: 'button',
        initialWidth: 75,
        typeAttributes: {
          label: 'Edit',
          name: 'edit',
          title: 'Edit',
          variant: 'base',
          disabled: false,
          value: 'edit',
          iconPosition: 'left'
        }
      },
      {
        type: 'button',
        initialWidth: 75,
        typeAttributes: {
          label: 'Delete',
          name: 'delete',
          title: 'Delete',
          variant: 'destructive',
          disabled: false,
          value: 'delete',
          iconPosition: 'left'
        }
      }
    ];
  }

  handleRowAction(event) {
    const action = event.detail.action;
    const row = event.detail.row;
    switch (action.name) {
      case 'edit':
        this.handleEditClick(row.Id);
        break;
      case 'delete':
        this.handleDeleteClick(row.Id);
        break;
      default:
        break;
    }
  }
}