import { LightningElement, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/BarChartController.getOpportunities'; 
export default class parentBarChart extends LightningElement {
    chartConfiguration;
    @wire(getOpportunities)
    getOpportunities({ error, data }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            console.log("data:"+JSON.stringify(data));
            let chartAmtData = [];
            let chartRevData = [];
            let chartLabel = [];
            data.forEach(opp => {
                chartAmtData.push(opp.totalAvailableVacancies);
                chartRevData.push(opp.totalFilledVacancies);
                chartLabel.push(opp.Name);
            });
            this.chartConfiguration = {
                type: 'bar',
                data: {
                    datasets: [{
                        label: 'Available Vacancies',
                        backgroundColor: "green",
                        data: chartAmtData,
                    },{
                        label: 'Filled Vacancies',
                        backgroundColor: "orange",
                        data: chartRevData,
                    },],
                    labels: chartLabel,
                },
                options: {},
            };
            console.log('data => ', data);
            this.error = undefined;
        }
    }
}