//product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../servise/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  oneProduct!: any;
  products!: any[];
  productEditStatus = false;
  selectedProduct: any;

  productForm!: FormGroup;

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getProducts();
    this.route?.data.subscribe(data => {
      this.initForm(data['oneProduct']);
    });
  }

  initForm(product: any): void {
    if(this.productEditStatus == true) {
      this.productForm = this.formBuilder.group({
        name: [this.selectedProduct.name, Validators.required],
        price: [this.selectedProduct.price, Validators.required]
      });
    } else {
      this.productForm = this.formBuilder.group({
        name: [this.oneProduct ? this.oneProduct.name : '', Validators.required],
        price: [this.oneProduct ? this.oneProduct.price : '', Validators.required]
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      if (this.productEditStatus == true && this.selectedProduct && this.selectedProduct.id) {
        this.productService.editProduct(this.selectedProduct.id, formData)
          .subscribe(() => this.oneProduct.emit());
          this.productEditStatus = false;
          location.reload();
      } else {
        this.productService.addProduct(formData)
          .subscribe(() => this.oneProduct.emit());
          location.reload();
      }
    }
  }

  onCancel(): void {
    this.productEditStatus = false;
    this.productForm.reset(); // Скидаємо значення форми
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => this.products = products)
  }
  editProduct(product: any): void {
    this.productEditStatus = true;
    this.selectedProduct = product;
    this.initForm(this.selectedProduct);
  }
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id)
      .subscribe(() => {
        this.products = this.products.filter(product => product.id !== id);
      });
  }
}
