import { Category } from './../models/category';
import { Product } from './../models/product';
import { AuthService } from './auth.service';
import { User } from './../models/user';
import { AngularFireList, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

listAll: AngularFireList<User>;
productsAll: AngularFireList<Product>;
categoryAll: AngularFireList<Category>;
productsPerCat: AngularFireList<Product>;
categoryRef: AngularFireObject<any>;
productRef: AngularFireObject<any>;
catRef: AngularFireObject<Category>;
prodRef: AngularFireObject<Product>;


constructor(
    private database: AngularFireDatabase,
    private authService: AuthService
  ) { }

getAll(){
  this.listAll = this.database.list('users/');
  return this.listAll;
}
/*
getAllProducts(id){
  this.productsAll = this.database.list('users/' + id + '/carta');
  return this.productsAll;
}
*/

getProductsPerCategory(id){
  this.productsPerCat = this.database.list('users/' + this.authService.userId + '/carta/' + id + '/products/');
  return this.productsPerCat;
}

getProductsPerCategoryForUser(idPlace, catId ){
  this.productsPerCat = this.database.list('users/' + idPlace + '/carta/' + catId + '/products/');
  return this.productsPerCat;
}

getAllCategories(id){
  this.categoryAll = this.database.list('users/' + id + '/carta');
  return this.categoryAll;
}

getAllCategoriesForMyRestaurant(){
  this.categoryAll = this.database.list('users/' + this.authService.userId + '/carta');
  return this.categoryAll;
}

getCat(id){
  this.catRef = this.database.object('users/' + this.authService.userId + '/carta/' + id);
  return this.catRef;
}

updateCat(id, catValue: Category){
  this.database.object('users/' + this.authService.userId + '/carta/' + id).update({
    category: catValue.category
  }).catch(error =>{
    this.errorMgmt(error);
  });
  return;
}

getProduct(id, catId){
  this.prodRef = this.database.object('users/' + this.authService.userId + '/carta/' + catId + '/products/' + id);
  return this.prodRef;
}

updateProduct(id, productValue: Product, catId) {
  this.database.object('users/' + this.authService.userId + '/carta/' + catId + '/products/' + id).update({
    title: productValue.title,
    description: productValue.description,
    price: productValue.price,
    image: productValue.image
  }).catch(error => {
    this.errorMgmt(error);
  });
  return;
}

newProduct(data: Product, catId, catCat){
  const newProduct = firebase.database().ref().child('users/' + this.authService.userId + '/carta/' + catId + '/products/').push().key;
  const product = {
    id: newProduct,
    categoryId: catId,
    category: catCat,
    title: data.title,
    description: data.description,
    price: data.price,
    image: data.image
  }
  const updates = {};
  updates['users/' + this.authService.userId + '/carta/' + catId + '/products/' + newProduct] = product;
  return firebase.database().ref().update(updates);
}

newCategory(cat: Category){
  const newCategory = firebase.database().ref().child('users/' + this.authService.userId + '/carta').push().key;
  const categoryStructure = {
    id: newCategory,
    category: cat.category
  }
  const updates = {};
  updates['users/' + this.authService.userId + '/carta/' + newCategory] = categoryStructure;
  return firebase.database().ref().update(updates);
}



deleteCategory(id) {
  this.categoryRef = this.database.object('users/' +  this.authService.userId + '/carta/' + id);
  this.categoryRef.remove()
    .catch(error => {
      console.log(error);
    });
}


deleteProduct(id, productId) {
  this.productRef = this.database.object('users/' +  this.authService.userId + '/carta/' + id + '/products/' + productId);
  this.productRef.remove()
    .catch(error => {
      console.log(error);
    });
}

private errorMgmt(error) {
  console.log(error);
}

}
