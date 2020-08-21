import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, } from '@angular/router';
import { UpdateService } from '../../../_services/update.service';
import { User } from '../../../_models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../../../data.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Product } from 'src/app/_models/product';

export interface Category {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  @Input() product: Product;
  @Input() isEditingActivated: boolean;

  @Output()
  cancelEditingClick: EventEmitter<boolean> = new EventEmitter<boolean>(); //creating an output event

  addForm: FormGroup;
  onlyNumbersMessage: string = "Bitte keinen Text oder negative Zahlen als Preis eingeben. 😉😉"
  showOnlyNumbersMessage: boolean = false;
  priceTooHigh = false;
  maxPrice: number = 250; // nobody is going to rent out a ferarri on that site...
  priceTooHighMessage: string = "Der Preis darf maximal " + this.maxPrice + " € betragen.";
  user: User;
  response: string;
  selectedFile: File;
  selectedFiles: File[] = [];


  visible = true;
  selectable = true;
  removable = true;
  categories: Category[] = [
    {
      name: 'Bohrmaschine',
      selected: false
    },
    {
      name: 'Leiter',
      selected: false
    },
    {
      name: 'WLAN',
      selected: false
    },
    {
      name: 'Staubsauger',
      selected: false
    },
    {
      name: 'DVD',
      selected: false
    },
    {
      name: 'Werkzeug',
      selected: false
    },
    {
      name: 'Grill',
      selected: false
    },
    {
      name: 'Grillzeug',
      selected: false
    },
    {
      name: 'Mixer',
      selected: false
    },
    {
      name: 'Küchenwaage',
      selected: false
    },
    {
      name: 'Waage',
      selected: false
    },
    {
      name: 'Gästematraze',
      selected: false
    },
    {
      name: 'Beamer',
      selected: false
    },
    {
      name: 'Fahrrad',
      selected: false
    },
    {
      name: 'Bücher',
      selected: false
    },
    {
      name: 'Brettspiele',
      selected: false
    },
    {
      name: 'Spielekonsole',
      selected: false
    },
    {
      name: 'Raclette',
      selected: false
    },
    {
      name: 'Campingausrüstung',
      selected: false
    },
    {
      name: 'Akkuschrauber',
      selected: false
    },
    {
      name: 'Schlitten',
      selected: false
    },
    {
      name: 'Schraubenzieher',
      selected: false
    },
    {
      name: 'Auto',
      selected: false
    },
    {
      name: 'Lebensmittel',
      selected: false
    },
    {
      name: 'Zeit',
      selected: false
    },
    {
      name: 'Stühle',
      selected: false
    },
  ];
  selectedCategory: Category;
  hasSelectedCategory: boolean = false;
  timeNow = new Date().toString().split(' ')[4]   // gives us the current time in format hh:mm:ss

  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  test: boolean = false;
  checked: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private _update: UpdateService,
    private _data: DataService,
    private router: Router) { }



  ngOnInit(): void {

    this.updateUser();   //  if the user changes, this will get updated
    this.addForm = this.formBuilder.group({            //https://angular.io/guide/reactive-forms
      description: ['', Validators.required],
      title: ['', Validators.required],
      price: ['0'],
      isBeerOk: [true],
      available: [true],
      startDate: [new Date()],
      endDate: [],
      pickUpTime: [this.timeNow.substring(0, this.timeNow.length - 3)],  //timeNow is in format hh:mm:ss, but we want only hh:mm, so we take the substring without the last 3 chars
      returnTime: ['']
    });
    // if (product) = true, bedeutet das, dass wir in der Produktbearbeitung sind und nicht in der Add-Product. Es gibt also schon ein Produkt, das uns als Inpt gegeben wurde und wir können das Formular schon vorab mit dem Titel und der Beschreibung befüllen.
    if (this.product) {
      this.addForm.patchValue({
        description: this.product.description,
        title: this.product.title
      })
    }
  }

  updateUser(): void {
    this._update.currentUser.subscribe(user => this.user = user)
  }


  pickedCategory(category: Category) {
    console.log("PICKED: ", category);
    if (category.selected) {
      category.selected = false;
      this.hasSelectedCategory = false;
    } else {
      this.categories.forEach(category => {
        if (category.selected == true) {
          category.selected = false;
          console.log("EACH: ", category, category.selected);
        }
      });
      category.selected = true;
      this.hasSelectedCategory = true;
    }
    console.log("Picked", category.name);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our category
    if ((value || '').trim()) {
      this.categories.forEach(category => {
        if (category.selected == true) {
          category.selected = false;
          console.log("EACH: ", category, category.selected);
        }
      });
      this.categories.push({ name: value.trim(), selected: true });
      this.hasSelectedCategory = true;
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  // https://angular.io/guide/component-interaction
  onFileSelected(selectedFiles: File[]) {
    this.selectedFiles = selectedFiles;
    console.log(this.selectedFiles)
  }



  // takes the error and then displays a response to the user or only logs the error on the console (depending on if the error is useful for the user)
  processError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      //A client-side or network error occurred.
      alert("Image could't be uploaded. Client-side error.")
      console.log('An client-side or network error occurred:', err.error.message);
    } else if (err.status == 304) {
      this.response = "Foto mit selbem Namen wurde vom gleichen User schonmal hochgeladen. 😄";
    } else if (err.status == 400) {
      this.response = "Foto mit selbem Namen wurde schonmal hochgeladen. 😢";
    } else if (err.status == 0) {
      this.response = "Foto abgelehnt, Foto muss kleiner 500KB sein. 😢";
    } else {
      //Backend returns unsuccessful response codes such as 404, 500 etc.
      console.log('Backend returned status code: ', err.status);
      console.log('Response body:', err.error);
    }
  }



  // for invalid characters (text, negative numbers...), prevent input
  inputValidator(event: any) {
    // https://stackoverflow.com/questions/37435529/proper-way-to-restrict-text-input-values-e-g-only-numbers?noredirect=1&lq=1
    if (event.target.value == '') {
      this.addForm.get('price').patchValue('');
      this.showOnlyNumbersMessage = true;
    } else {
      this.showOnlyNumbersMessage = false;
    }
    if (this.addForm.get('price').value > this.maxPrice) {
      this.priceTooHigh = true;
    } else {
      this.priceTooHigh = false;
    }
  }

  onSubmit() {
   
    console.log(this.addForm.value);

    var formData: any = new FormData();
    // wenn das produkt schon existiert und auch eine id schon hat, bedeutet das, dass wir in der Produktbearbeitung sind und nicht im Add-Product. Es gibt also schon ein Produkt, das uns als Inpt gegeben wurde und wir können die productID mit dem Formular mitschicken. Erhält das Backend eine id, so update es das existierende Produkt, statt ein neues anzulegen.
    if (this.product && this.product.id) {
      formData.append("id", this.product.id);
    }
    formData.append("description", this.addForm.get('description').value);
    formData.append("title", this.addForm.get('title').value);
    console.log("bla", this.categories)
    this.categories.forEach(category => {
      if (category.selected == true) {
        formData.append("category", category.name);
        console.log("APPEND: ", category, category.selected);
      }
    });
    formData.append("price", this.addForm.get('price').value);
    formData.append("isBeerOk", this.addForm.get('isBeerOk').value);
    formData.append("userId", this.user.id);
    // https://www.epochconverter.com/
    if (this.addForm.get('startDate').value) formData.append("startDate", this.addForm.get('startDate').value.getTime() / 1000.0);   // transforms the startTime to MILLISECONDS since 1970-01-01 (epoche time)
    console.log(this.addForm.get('startDate').value.getTime() / 1000.0);
    if (this.addForm.get('endDate').value) formData.append("endDate", this.addForm.get('endDate').value.getTime() / 1000.0);
    formData.append("pickUpTime", this.addForm.get('pickUpTime').value)
    formData.append("returnTime", this.addForm.get('returnTime').value)
    // the images have to be appended each at a time: https://stackoverflow.com/questions/47538736/upload-multiple-files-with-angular-to-spring-controller
    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file);
    });

    if (!this.isEditingActivated) {
 //adds the product
 this._data.addProduct(formData)
 .subscribe((res: any) => {
   console.log(res);
   this.router.navigate(['products']);
 }, (err: any) => {
   console.log(err);
 }
 );
    } else {
       // updates the product
    this._data.editProduct(formData)
    .subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['products']);
    }, (err: any) => {
      console.log(err);
    }
    );
    }
   

    // we empty the selected Files array after uploading the pictures.
    this.selectedFiles = [];
  }

  cancel() {
    this.router.navigate(['products']);
  }

  cancelEditing() {
    // this.router.navigate(['product-details/' + this.product.id]);
   this.cancelEditingClick.emit(false); //emmiting that the editing is canceled
  }
}

