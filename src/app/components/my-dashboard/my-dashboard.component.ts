import { Router } from '@angular/router';
import { Category } from './../../models/category';
import { Product } from './../../models/product';
import { ProductService } from './../../service/product.service';
import { FormGroup, FormControl, FormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from './../../models/user';
import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {

ListOfCategories: AngularFireList<Category>;
ListOfProducts: AngularFireList<Product>;
imgSrc: any;
uploadedPic: boolean;
selectedImage: any = null;
oldImage: File;

userId: any;
profileInfo: AngularFireObject<User>;
productList: Product[];
productListPerCat: Product[];
viewProductCat: Category[];
nuevaCat: boolean;
key: any;
viewMoreCat:Category[];
viewMoreCatTest: Category[];
fetchProducts: Product[];

expandedCategory: Category[];
categoryToOpen: Category[];
noCatCreated: boolean;
isSubmitted: boolean;
editingCat: boolean = false;
editingProd: boolean = false;


categoryList: Category[];
filteredCategory: Category[];
categoryTest: string;
selectedCat: string;
selectedProd: string;

isPictureOpen: boolean;
pictureSelected: Product;


filteredList: Product[];
name: string;
name2: string;
items: {};
image: File;
direccion: string;

formProduct = new FormGroup({
  id: new FormControl(''),
  category: new FormControl(''),
  title: new FormControl('', Validators.required),
  description: new FormControl(''),
  price: new FormControl('', [Validators.required, Validators.pattern("[0-9-,.]+")]),
  image: new FormControl('')
});

formCat = new FormGroup({
  category: new FormControl('', Validators.required),
});

popUpOpen = false;
popUpOpenProduct = false;

openPopUp() {
  this.popUpOpen = true;
}

cancelOption() {
  this.popUpOpen = false;
  this.editingCat = false;
  this.formCat.reset();
  this.formProduct.reset();
}


openPopUpProduct(cat) {
  this.popUpOpenProduct = true;
}

cancelOptionProduct() {
  this.popUpOpenProduct = false;
  this.isSubmitted = false;
  this.uploadedPic = false;
  this.imgSrc = null;
  this.editingProd = false;
  this.selectedProd = null;
  this.selectedImage = null;
}



  constructor(
    public authService: AuthService,
    private product: ProductService,
    private router: Router,
    private storage: AngularFireStorage
  ) {

  }

  ngOnInit() {
this.userId = this.authService.userId;
this.getData(this.authService.userId);


var z = this.product.getAllCategories(this.authService.userId);

var z = this.product.getAllCategories(this.authService.userId);
z.valueChanges().subscribe(item => {
  this.categoryList = [];
  this.productListPerCat = [];
  item.forEach(element => {
    var y = element;
    this.categoryList.push(y as Category);
    console.log(element.id);
    var v = this.product.getProductsPerCategory(element.id);
    v.valueChanges().subscribe(item => {
    item.forEach(elementProd => {
      var v = elementProd;
      console.log(v.id);
      this.productListPerCat.push(v as Product);
      });
    });
  });
 });
}

clickNuevaCat() {
  this.nuevaCat = true;
}







/*


var z = this.product.getAllCategories(this.authService.userId);
z.snapshotChanges().subscribe(item => {
  this.categoryList = [];
  this.productListPerCat = [];
  item.forEach(element => {
    var y = element.payload.toJSON();
    y["$key"] = element.key;
    this.categoryList.push(y as Category);
    this.filteredCategory = this.categoryList;


    var v = this.product.getProductsPerCategory(element.key);
    v.snapshotChanges().subscribe( item => {
    item.forEach(elementProd => {
      var v = elementProd.payload.toJSON();
      v["$key"] = elementProd.key;
      this.productListPerCat.push(v as Product);
    })
    })

  });
});



*/

/*

var z = this.product.getAllCategories(this.authService.userId);
z.valueChanges().subscribe(item => {
  this.categoryList = [];
  this.productListPerCat = [];
  item.forEach(element => {
    var y = element;
    this.categoryList.push(y as Category);
    console.log(element.$key);
    var v = this.product.getProductsPerCategory(element.id);
    v.valueChanges().subscribe(item => {
    item.forEach(elementProd => {
      var v = elementProd;
      this.productListPerCat.push(v as Product);
      })
    })
  });
 });
*/


getData(id) {
  this.authService.getProfileForMyDashboard(id).subscribe(
    res => {
      this.name = res.payload.val().name;
      this.image = res.payload.val().image;
      this.direccion = res.payload.val().direccion;
      console.log(this.name);
    });
}


showPreview(event){
  if(event.target.files && event.target.files[0]){
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.imgSrc = e.target.result;
      this.uploadedPic = true;
    }
    this.selectedImage = event.target.files[0];
  } else {
    this.imgSrc = null;
    this.selectedImage = null;
    console.log('showPreview doesnt not work');
  }
}

removePic(){
  this.imgSrc = null;
  this.uploadedPic = false;
  this.selectedImage = null;
}

onSubmit(form, catId, catCat) {
  this.isSubmitted = true;
  if (this.formProduct.valid) {
    if(this.uploadedPic === true){
    var filePath = `${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          form['image'] = url;
          this.product.newProduct(form, catId, catCat);
          this.formProduct.reset();
          this.isSubmitted = false;
          this.imgSrc = null;
          this.uploadedPic = false;
          this.selectedImage = null;
        });
      })
    ).subscribe();
  } else {
    this.product.newProduct(form, catId, catCat);
    this.formProduct.reset();
    this.isSubmitted = false;
  }
  } else {
    console.log('error');
  }
}

onSubmitCat(formCat){
  if(this.formCat){
    this.product.newCategory(formCat);
    this.popUpOpen = false;
    this.formCat.reset();
  } else {
    console.log('error');
  }
}

onDeleteCat(id){
  this.product.deleteCategory(id);
}

onEditCat(id){
  this.popUpOpen = true;
  this.editingCat = true;
  this.selectedCat = id;
  const sub = this.product.getCat(id).valueChanges().subscribe(res => {
    this.formCat.patchValue({
      $key: id,
      category: res.category
    });
    sub.unsubscribe();
  });
}

onSubmitEditCat(formValue){
  this.product.updateCat(this.selectedCat, formValue);
  this.cancelOption();
  this.formCat.reset();
  formValue.reset();
}

onEditProduct(id, catId, cat) {
  this.openPopUpAddProduct(cat);
  this.editingProd = true;
  this.selectedProd = id;
  const prod = this.product.getProduct(id, catId).valueChanges().subscribe(res => {
    if (res.image != null ) {
      this.uploadedPic = true;
      this.imgSrc = res.image;
      this.oldImage = res.image;
      this.formProduct.patchValue({
        title: res.title,
        description: res.description,
        price: res.price,
      });
    } else {
      this.formProduct.patchValue({
        title: res.title,
        description: res.description,
        price: res.price,
      });
    }
    prod.unsubscribe();
  });
}

onSubmitEditProduct(formValue, catId){
  if(this.imgSrc === null){
    this.product.updateProduct(this.selectedProd, formValue, catId);
    this.cancelOptionProduct();
    this.unselectProductMore(null);
    this.formProduct.reset();
  } else if(this.oldImage === this.imgSrc) {
          formValue.image = this.imgSrc;
          this.product.updateProduct(this.selectedProd, formValue, catId);
          this.cancelOptionProduct();
          this.formProduct.reset();
        } else {

          console.log(this.oldImage);
          console.log(this.imgSrc);
          var filePath = `${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
          const fileRef = this.storage.ref(filePath);
          this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                formValue['image'] = url;
                this.product.updateProduct(this.selectedProd, formValue, catId);
                this.cancelOptionProduct();
                this.formProduct.reset();
              });
            })
          ).subscribe();
  }
}

onDeleteProduct(id, productId){
  console.log(id, productId);
  if(confirm('¿Estas seguro de borrar el producto?')){
    this.product.deleteProduct(id, productId);
  }
}


onSignOut(){
  this.authService.SignOut();
}


selectViewMore(item, catId){
  this.viewMoreCat = item.category;
}

unselectViewMore(item){
  this.viewMoreCat = null;

 // this.makeViewMore(null)
}

makeViewMore(item) {
  return this.viewMoreCat === item.category;
}





openPopUpAddProduct(item){
  this.viewProductCat = item;
}

unselectProductMore(item){
  this.viewProductCat = [];
  this.imgSrc = null;
  this.uploadedPic = false;
  this.selectedImage = null;
  this.editingProd = false;
  this.formProduct.reset();
 // this.makeViewMore(null)
}

makeProductMore(item) {
  return this.viewProductCat === item;
}

editButtonClick(id){
  this.router.navigate(['editar/', id]);
}

openPicture(prod){
  this.pictureSelected = prod;
  this.isPictureOpen = true;
}
closePicture(){
  this.isPictureOpen = false;
  this.pictureSelected = null;
}


get formsControls() {
  return this.formProduct['controls'];
}

get formsControlsCat() {
  return this.formCat['controls'];
}



}
