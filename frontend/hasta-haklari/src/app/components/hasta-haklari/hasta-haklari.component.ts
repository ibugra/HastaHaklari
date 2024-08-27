import { Component, OnInit, ViewChild } from '@angular/core';
import { Applicant } from '../../model/applicant';
import { ApplicantService } from '../../service/applicant.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-hasta-haklari',
  templateUrl: './hasta-haklari.component.html',
  styleUrl: './hasta-haklari.component.css',
})
export class HastaHaklariComponent implements OnInit{
[x: string]: any;
  applicants: Applicant[] = [];

  displayDialog: boolean = false;
  displayEditDialog: boolean = false;
  
  editApplicant?: Applicant;

  applicationsTypes: string[] = ["Öneri", "Şikayet", "Memnuniyet"];
  statusTypes: string[] = ["Başvuru Kayıt", "Sonuç Bekliyor", "Sonuçlandı"];
  statusTypes2: string[] = ["Sonuç Bekliyor", "Sonuçlandı"];

  now = new Date();

  searchValue: string | undefined;

  constructor(private applicantService: ApplicantService, private fb: FormBuilder,
    private confirmationService: ConfirmationService, private messageService: MessageService
  ){

  }

  ngOnInit(): void {
    this.getApplications(); 
  }

  applicantForm = this.fb.group({
    applicantId: new FormControl<number>(0),
    name: ["", [Validators.required]],
    surname: ["", [Validators.required]],
    suggestion: ["", [Validators.required]],
    type: ["", [Validators.required]],
    date: ["", [Validators.required]],
    status: ["", [Validators.required]],
  })

  get applicantId(){
    return this.applicantForm.controls['applicantId'];
  }

  get firstName() {
    return this.applicantForm.controls['name'];
  }

  get lastName() {
    return this.applicantForm.controls['surname'];
  }

  get sugg() {
    return this.applicantForm.controls['suggestion'];
  }

  get type(){
    return this.applicantForm.controls['type'];
  }

  get getDate(){
    return this.applicantForm.controls['date'];
  }

  spareList: Applicant[] =[];

  public getApplications(): void{
    this.applicantService.getApplications().subscribe(
      (response: Applicant[]) => {
        this.applicants = response;
        this.spareList = response;
      }
    )
  }

  public saveApplications(){
    const postData = this.applicantForm.value;

    const editDate = postData.date?.split(".");

    const day = parseInt(editDate![0], 10);
    const month = parseInt(editDate![1], 10);
    const year = parseInt(editDate![2], 10);

    if(month < 10){
      postData.date = year + ".0" + month + "." + day;
    }
    if(day < 10){
      postData.date = year + "." + month + ".0" + day;
    }
    if(day < 10 && month < 10){
      postData.date = year + ".0" + month + ".0" + day;
    }
    if(day > 10 && month > 10){
      postData.date = year + "." + month + "." + day;
    }

    postData.name = this.upperFirstLetter(postData.name!);
    postData.surname = this.upperFirstLetter(postData.surname!);
    postData.suggestion = this.upperFirstLetter(postData.suggestion!);

    
    this.applicantService.saveApplication(postData as Applicant).subscribe(
      (response: Applicant) => {
        this.getApplications();
        this.applicantForm.reset();
      }
    )
    this.messageService.add({ severity: 'success', summary: 'Onay', detail: 'Başvuru Onaylandı!' });
  }

  public updateApplications(applicant: Applicant): void{
    const editDate = applicant.date?.split(".");

    if(editDate[0].split("").length != 4){
      const day = parseInt(editDate[0], 10);
      const month = parseInt(editDate[1], 10);
      const year = parseInt(editDate[2], 10);

      if(month < 10){
        applicant.date = year + ".0" + month + "." + day;
      }
      if(day < 10){
        applicant.date = year + "." + month + ".0" + day;
      }
      if(day < 10 && month < 10){
        applicant.date = year + ".0" + month + ".0" + day;
      }
      if(day > 10 && month > 10){
        applicant.date = year + "." + month + "." + day;
      }

    }

    applicant.name = this.upperFirstLetter(applicant.name);
    applicant.surname = this.upperFirstLetter(applicant.surname);
    applicant.suggestion = this.upperFirstLetter(applicant.suggestion);
    
    if(applicant.result != null){
      applicant.result = this.upperFirstLetter(applicant.result);
    }
    
    this.applicantService.updateApplications(applicant).subscribe(
      (response: Applicant) => {    
        this.getApplications();
      }
    )
  }

  public deleteApplications(applicationsId: number){
    this.applicantService.deleteApplications(applicationsId).subscribe(
      (response: void) => {
        this.getApplications();
      }
    )
  }

  deleteBoolean: boolean = false;

  confirmationDelete(event: Event, applicant: Applicant){
    this.deleteBoolean = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Kaydı silmek istediğinize emin misiniz?',
      header: 'Kayıt Silme',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-text accept-button",
      rejectButtonStyleClass:"p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Onay', detail: 'Kayıt silme onaylandı' });
          this.deleteBoolean = false;
          setTimeout(() => {
            this.deleteApplications(applicant.applicantId);
          }, 500);
      },
      reject: (type: any) => {
        switch(type) {
          case ConfirmEventType.REJECT:
              this.messageService.add({severity:'error', summary:'Red', detail:'Silme işlemi reddedildi'});
              this.deleteBoolean = false;
          break;
          case ConfirmEventType.CANCEL:
              this.messageService.add({severity:'warn', summary:'İptal', detail:'Silme işlemi iptal edildi'});
              this.deleteBoolean = false;
          break;
        }
      }
  });
  }


  showDialog(){
    this.displayDialog = true;
  }

  disabledString: string = "false";
  disabledBoolean: boolean = false;
  disable: boolean = false;
  stringForStatus: string = "false";

  showDate?: string;

  showEditDialog(applicant: Applicant){
    console.log(applicant.date);
    this.stringDate = this.convertStringToDate(applicant.date);

    console.log("before in editDialog: " + this.showDate);

    const editDate = applicant.date?.split(".");

    if(editDate[0].split("").length == 4){
      const year = parseInt(editDate[0], 10);
      const month = parseInt(editDate[1], 10);
      const day = parseInt(editDate[2], 10);

      if(month < 10){
        this.showDate = day + ".0" + month + "." + year;
      }
      if(day < 10){
        this.showDate = "0" + day + "." + month + "." + year;
      }
      if(day < 10 && month < 10){
        this.showDate = "0" + day + ".0" + month + "." + year;
      }
      if(day > 10 && month > 10){
        this.showDate = day + "." + month + "." + year;
      }

    }

    console.log("after in editDialog: " + this.showDate);
    

    this.editApplicant = applicant;
    this.displayEditDialog = true;

    this.selectedValue = this.editApplicant.status;

    if(this.editApplicant.status.includes("Sonuçlandı")){
      this.disabledString = "true";
      this.disabledBoolean = true;
      this.disable = true;
      this.stringForStatus = "true";
    }
    else if(this.editApplicant.status.includes("Sonuç Bekliyor")) {
      this.disable = false;
      this.disabledString = "true";
      this.disabledBoolean = true;
      this.stringForStatus = "false";
    }
    else{
      this.disabledString = "false";
      this.disabledBoolean = false;
      this.disable = false;
      this.stringForStatus = "false";
    }

  }

  message: string = "";
  mBoolean: boolean = true;

  searchString?: string;

  public searchApplications(): void{
    this.applicants = this.spareList;

    const results: Applicant[] = [];
    this.searchString = this.searchTerm;
    for (const applicant of this.applicants) {
      if (applicant.name.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1
      || applicant.surname.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1
      || applicant.suggestion.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1) {
        results.push(applicant);
      }
    }
    this.applicants = results;
    if (results.length === 0) {
      this.mBoolean = false;
      this.message = "Veri bulunamadı!!!";
    }
    if(!this.searchTerm){
      this.message = "";
      this.mBoolean = true;
      this.getApplications();
    }
  }

  statusApplicant?: Applicant;

  public findByIdAndUpdateStatus(applicant: Applicant): void{
    this.applicantService.findById(applicant.applicantId).subscribe(
      (response: Applicant) => {
        this.getApplications();
        this.statusApplicant = response;
        this.statusApplicant.status = applicant.status;
        this.applicantService.updateApplications(this.statusApplicant).subscribe(
          (response: Applicant) => {
            this.getApplications();
          }
        )
      }
    )
  }

  selectedValue: any;

  onDropdownChange(event: any) {
    console.log("Dropdown changed:", event.value);
    this.selectedValue = event.value; // Explicitly update the variable if needed
  }

  stringDate?: Date;

  convertStringToDate(dateString: string): Date {
    // Split the date string into day, month, and year
    const parts = dateString.split(".");
  
    if (parts.length !== 3) {
      throw new Error("Invalid date format. Expected 'dd.mm.yyyy'");
    }
  
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript Date
    const day = parseInt(parts[2], 10);
  
    // Create and return the date
    const date = new Date(year, month, day);
  
    // Ensure the constructed date matches the input values to avoid issues like invalid dates
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      throw new Error("Invalid date");
    }

    return date;
  }


  upperFirstLetter(editStr: string): string{
    if (editStr.length === 0) {
      return editStr;
    }
  
    const firstLetter = editStr[0].toUpperCase();
    const remainingString = editStr.slice(1);
    
    return firstLetter + remainingString;
  }

  @ViewChild('dt') dt!: Table;

  searchTerm: string = '';

  resetFilters() {
    if (this.dt) {
      this.dt.clear(); // Clears all filters
      this.getApplications();
      this.searchString = "";
      this.searchTerm = '';
      this.rangeDates = undefined as any;
    }
    else if (!this.dt){
      this.getApplications();
      this.searchString = "";
      this.searchTerm = '';
      this.rangeDates = undefined as any;
    }
  }

  rangeDates: Date[] | undefined;

  searchDateRange(){  
    const results: Applicant[] = [];

    if(this.rangeDates![0] && this.rangeDates![1]){
      this.applicants = this.spareList;

      for (const applicant of this.applicants) {
        const date = this.convertStringToDate(applicant.date);
        if(date < this.rangeDates![1] && date > this.rangeDates![0]){
          results.push(applicant);
        }
      }
      this.applicants = results;
  
      if (results.length === 0) {
        this.mBoolean = false;
        this.message = "Veri bulunamadı!!!";
      }

    }
  }


}