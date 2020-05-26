import { Router } from '@angular/router';
import { User } from './../../models/user';
import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

filteredList: User[];
fullList: User[];
show: boolean;

private _searchTerm: string;

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string){
    if (value === ''){
      this.show = false;
    } else if (value !== ''){
      this.show = true;
    }
    this._searchTerm = value;
    this.filteredList = this.filterList(value);
  }

  filterList(searchString: string){
    return this.fullList.filter(user =>
      user.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 ||
      user.direccion.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 );
  }


  constructor(
    private product: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    var x = this.product.getAll();
    x.snapshotChanges().subscribe(item => {
      this.fullList = [];
      item.forEach(element => {
        var y: any = element.payload.toJSON();
        y['$key'] = element.key;
        if(y.name === undefined){
        } else{
          this.fullList.push(y as User);
        }
      });
    });
  }

  viewCarta(id){
    this.router.navigate(['view/', id]);
  }

}
