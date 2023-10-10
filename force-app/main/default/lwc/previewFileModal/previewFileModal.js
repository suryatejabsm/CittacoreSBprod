import { LightningElement, api } from "lwc";

export default class PreviewFileModal extends LightningElement {
  @api url;
  @api Extension;
  showFrame = false;
  showModal = false;
  @api show() {
    console.log("###showFrame : " + this.Extension);
    if (this.Extension === "png") this.showFrame = true;
    else this.showFrame = false;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}