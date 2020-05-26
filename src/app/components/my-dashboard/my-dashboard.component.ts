import { Router } from '@angular/router';
import { Category } from './../../models/category';
import { Product } from './../../models/product';
import { ProductService } from './../../service/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {

imgSrc: any;
uploadedPic: boolean;
selectedImage: any = null;
oldImage: File;
productListPerCat: Product[];
viewProductCat: Category[];
nuevaCat: boolean;
viewMoreCat: Category[];
isSubmitted: boolean;
editingCat: boolean;
editingProd: boolean;
popUpOpen: boolean;
popUpOpenProduct: boolean;
categoryList: Category[];
selectedCat: string;
selectedProd: string;
isPictureOpen: boolean;
pictureSelected: Product;
name: string;
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
  this.selectedProd = null;
  this.selectedImage = null;
  this.editingProd = false;
}

  constructor(
    public authService: AuthService,
    private product: ProductService,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.getData();
    const z = this.product.getAllCategoriesForMyRestaurant();
    z.valueChanges().subscribe(item => {
      this.categoryList = [];
      this.productListPerCat = [];
      item.forEach(element => {
        const y = element;
        this.categoryList.push(y as Category);
        const v = this.product.getProductsPerCategory(element.id);
        v.valueChanges().subscribe(item => {
        item.forEach(elementProd => {
          const v = elementProd;
          this.productListPerCat.push(v as Product);
          });
        });
      });
    });
}

clickNuevaCat() {
  this.nuevaCat = true;
}

getData() {
  this.authService.getProfileForMyDashboard().subscribe(
    res => {
      this.name = res.payload.val().name;
      this.image = res.payload.val().image;
      this.direccion = res.payload.val().direccion;
    });
}

showPreview(event){
  if (event.target.files && event.target.files[0]){
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.imgSrc = e.target.result;
      this.uploadedPic = true;
    }
    this.selectedImage = event.target.files[0];
  } else {
    this.imgSrc = null;
    this.selectedImage = null;
  }
}

removePic() {
  this.imgSrc = null;
  this.uploadedPic = false;
  this.selectedImage = null;
}

onSubmit(form, catId, catCat) {
  this.isSubmitted = true;
  if (this.formProduct.valid) {
    if (this.uploadedPic === true) {
    const filePath = `${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
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

onSubmitCat(formCat) {
  this.product.newCategory(formCat);
  this.cancelOption();
}

onDeleteCat(id) {
  this.product.deleteCategory(id);
}

onEditCat(id) {
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

onSubmitEditCat(formValue) {
  this.product.updateCat(this.selectedCat, formValue);
  this.cancelOption();
}

onEditProduct(id, catId, cat) {
  this.openPopUpAddProduct(cat);
  this.editingProd = true;
  this.selectedProd = id;
  const prod = this.product.getProduct(id, catId).valueChanges().subscribe(res => {
      this.imgSrc = res.image;
      this.oldImage = res.image;
      if(this.imgSrc !== ''){
        this.uploadedPic = true;
      }
      this.formProduct.patchValue({
        title: res.title,
        description: res.description,
        price: res.price,
      });
      prod.unsubscribe();
  });
}

onSubmitEditProduct(formValue, catId){

  if (this.oldImage === this.imgSrc) {

      console.log('imgSrc is igula to OldImage');
      formValue.image = this.imgSrc;
      this.product.updateProduct(this.selectedProd, formValue, catId);
      this.cancelOptionProduct();
      this.formProduct.reset();
      }   else if(this.imgSrc === null) {
          console.log('imgSrc is null');
          formValue.image = '';
          this.product.updateProduct(this.selectedProd, formValue, catId);
          this.cancelOptionProduct();
          this.formProduct.reset();
  } else {
          console.log('is going through else');
          const filePath = `${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
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
}

makeProductMore(item) {
  return this.viewProductCat === item;
}

editButtonClick() {
  this.authService.editMyProfile();
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
