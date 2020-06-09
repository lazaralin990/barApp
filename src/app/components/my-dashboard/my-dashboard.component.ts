import { Router } from '@angular/router';
import { Category } from './../../models/category';
import { Product } from './../../models/product';
import { ProductService } from './../../service/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../service/auth.service';
import { Component, OnInit, AfterContentInit } from '@angular/core';
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
indexCategoryList: Category[];
selectedCat: string;
selectedProd: string;
isPictureOpen: boolean;
pictureSelected: Product;
name: string;
image: File;
direccion: string;
removedPic: boolean;
maxI: number;
maxIProd: number;
loading: boolean;

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
  order: new FormControl('')
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
    this.product.getAllCategoriesForMyRestaurant().valueChanges().subscribe(item => {
      this.categoryList = [];
      this.loading = true;
      this.maxI = 0;
      item.forEach(element => {
        this.categoryList.push(element as Category);
        this.categoryList.sort(function(a, b) {
          return a.order - b.order;
        });
        if (element.order === undefined) {
          this.product.updateCatIndex(element.id, this.maxI).then(res => {
            return;
        });
        }
        this.maxI += 1;
      });
      this.loading = false;
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
  if (event.target.files && event.target.files[0]) {
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
  this.removedPic = true;
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
          form['order'] = this.maxIProd;
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
    form['order'] = this.maxIProd;
    this.product.newProduct(form, catId, catCat);
    this.formProduct.reset();
    this.isSubmitted = false;
  }
  } else {
    console.log('error');
  }
}

onSubmitCat(formCat) {
  formCat['order'] = this.maxI;
  console.log(formCat.order);
  this.product.newCategory(formCat);
  this.cancelOption();
}

onDeleteCat(id, i) {
  if(confirm('¿Estas segur@ de borrar la categoría?')){
        if(i === this.maxI - 1) {
          this.product.deleteCategory(id).then(res => {
            return;
          });
        } else {
          this.product.deleteCategory(id).then(res => {
            this.updateIndexCategories(i);
          });
        }
  }
}

updateIndexCategories(i) {
  const z = this.product.getAllCategoriesForMyRestaurant().valueChanges().subscribe(item => {
  this.categoryList = [];
  item.forEach(element => {
    if (element.order > i) {
      this.product.updateCatIndex(element.id, element.order - 1).then(res => {
        return;
      });
    } else {
      return;
    }
  });
  z.unsubscribe();
});
}

updateIndexProduct(catId, i) {
  const z = this.product.getProductsPerCategoryForAuthUser(catId).valueChanges().subscribe(prod => {
  this.categoryList = [];
  prod.forEach(element => {
    if (element.order > i) {
      this.product.updateProductIndex(catId, element.id, element.order - 1).then(res => {
        return;
      });
    }
  });
  z.unsubscribe();
});
}


onChangingOrder(id1, id2, i1, i2) {
  this.product.updateCatIndex(id1.id, i2).then(res => {
    this.product.updateCatIndex(id2.id, i1);
  });
}

onChangingOrderProduct(cat, prod1, i1, prod2, i2) {
  this.product.updateProductIndex(cat.id, prod1.id, i2).then(res => {
    this.product.updateProductIndex(cat.id, prod2.id, i1);
  });
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
      formValue.image = this.imgSrc;
      if(formValue.image === undefined) {
        formValue['image'] = '';
      }
      if(formValue.description === undefined) {
        formValue['description'] = '';
      }
      this.product.updateProduct(this.selectedProd, formValue, catId);
      this.cancelOptionProduct();
      this.formProduct.reset();
      } else if(this.imgSrc === null) {
          formValue['image'] = '';
          if(formValue.description === undefined) {
            formValue['description'] = '';
          }
          this.product.updateProduct(this.selectedProd, formValue, catId);
          this.cancelOptionProduct();
          this.formProduct.reset();
    } else {
          const filePath = `${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
          const fileRef = this.storage.ref(filePath);
          this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                formValue['image'] = url;
                if(formValue.description === undefined) {
                  formValue['description'] = '';
                }
                if(formValue.image === undefined) {
                  formValue['image'] = '';
                }
                this.product.updateProduct(this.selectedProd, formValue, catId);
                this.cancelOptionProduct();
                this.formProduct.reset();
              });
            })
          ).subscribe();
  }
}

onDeleteProduct(catId, productId, i){
  if(confirm('¿Estas segur@ de borrar el producto?')){
    if (i === this.maxIProd - 1){
      this.product.deleteProduct(catId, productId).then(res => {
      return;
      });
    } else {
      this.product.deleteProduct(catId, productId).then(res => {
        this.updateIndexProduct(catId, i);
      });
    }
  }
}


onSignOut(){
  this.authService.SignOut();
}


selectViewMore(item, catId){
  this.product.getProductsPerCategoryForAuthUser(catId).valueChanges().subscribe(prod => {
    this.productListPerCat = [];
    this.maxIProd = 0;
    prod.forEach((elementProd) => {
        this.productListPerCat.push(elementProd as Product);
        this.productListPerCat.sort(function(a, b) {
          return a.order - b.order;
        });
        if (elementProd.order === undefined){
          this.product.updateProductIndex(catId, elementProd.id, this.maxIProd).then(res => {
        });
        }
        this.maxIProd += 1;
    });
 });
  this.viewMoreCat = item.category;
}

unselectViewMore(item){
  this.productListPerCat = [];
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
