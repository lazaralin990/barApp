import { AuthService } from './../../service/auth.service';
import { Product } from './../../models/product';
import { Category } from './../../models/category';
import { ProductService } from './../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-carta',
  templateUrl: './view-carta.component.html',
  styleUrls: ['./view-carta.component.css']
})
export class ViewCartaComponent implements OnInit {

  barId: string;
  categoryList: Category[];
  productListPerCat: Product[];
  name: string;
  image: File;
  direccion: string;
  viewMoreCat: Category[];
  isPictureOpen: boolean;
  pictureSelected: Product;
  viewCategory: Category[];
  maxI: number;
  maxIProd: number;
  noProducts: boolean = false;
  isLoading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private product: ProductService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  this.activatedRoute.paramMap.subscribe(params => {
    this.barId = params.get('id');
    if (this.barId){
      this.getData(this.barId);
      const z = this.product.getAllCategories(this.barId);
      z.valueChanges().subscribe(item => {
        this.categoryList = [];
        this.productListPerCat = [];
        item.forEach(element => {
          const y = element;
          y.numberProducts = 0;
          const k = this.product.getProductsPerCategoryForUser(this.barId, element.id);
          k.valueChanges().subscribe(item => {
          item.forEach(elementProd => {
            y.numberProducts += 1;
            const v = elementProd;
            this.productListPerCat.push(v as Product);
            this.productListPerCat.sort(function(a, b){
              return a.order - b.order;
            });
            });
          });
          this.categoryList.push(y as Category);
          this.categoryList.sort(function(a, b){
            return a.order - b.order;
          });
        });
       });
    }
  });
  }

  getData(id) {
    this.authService.getProfileRestaurant(id).subscribe(
      res => {
        this.name = res.payload.val().name;
        this.image = res.payload.val().image;
        this.direccion = res.payload.val().direccion;
      });
  }


  selectViewMore(item: any) {
    this.viewMoreCat = item.category;
  }
  unselectViewMore() {
    this.viewMoreCat = null;
  }
  makeViewMore(item: any) {
    return this.viewMoreCat === item.category;
  }

  expandedCat(item) {
    return this.viewCategory = item;
  }


  openPicture(prod: any) {
    this.pictureSelected = prod;
    this.isPictureOpen = true;
  }
  closePicture() {
    this.isPictureOpen = false;
    this.pictureSelected = null;
  }

}
