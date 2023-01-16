import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy,OnChanges {
  @Input() activeClip: IClip | null  = null
  @Output() updateClip = new EventEmitter()
  clipID = new FormControl('')

  //alert message config
  showAlert = false
  alertColor ='blue'
  inSubmission= false
  alertMsg ='Please wait! Updating clip.'
  //end alert message config

  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  editForm = new FormGroup({
    title: this.title
  })
  constructor(private modal:ModalService, private clipService: ClipService) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeClip){
      return
    }
    this.inSubmission= false
    this.showAlert=false
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  async submit(){
    if(!this.activeClip){
      return
    }
    this.showAlert = true
    this.inSubmission = true

    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip.'
    try{
      await this.clipService.upateClip((this.clipID.value),  this.title.value)
      
    }catch(e) {
      this.inSubmission = false

      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong.Try again later'
      return
    }
    
    this.activeClip.title = this.title.value
    this.updateClip.emit(this.activeClip)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success'
  }
}
