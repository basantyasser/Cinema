import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/CategoryModel';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  title: string;
  btnTitle: string;
  catForm: FormGroup;
  category: Category;
  message: string;
  id: number;

  messageValidate = {
    catName: {
      required: ' Required Category Name',
      max: 'The maximum number of characters is 150',
    },
  };

  ngOnInit(): void {
    this.title = 'Add a new category ';
    this.btnTitle = 'Add';
    this.category = {
      id: 0,
      categoryName: ''
    };
    this.id = 0;

    this.catForm = this.fb.group({
      catName: ['', [Validators.required, Validators.maxLength(150)]]
    })

    this.activateRoute.paramMap.subscribe(param => {
      var id = +param.get('id');
      var name = param.get('id1');

      if (id && name) {
        this.title = 'Modify category data';
        this.btnTitle = 'Modify and save';
        this.id = id;
        this.catForm.patchValue({
          catName: name
        });
      }
    })
  }

  AddCategory() {
    var name = this.catForm.value.catName;
    if (name) {
      if (this.id > 0) {
        this.category.id = this.id;
        this.category.categoryName = name;
        this.service.EditCategory(this.category).subscribe(cat => {
          this.GoToList();
        }, ex => {
          this.message = null;
          console.log(ex);
        })
      } else {
        this.category.id = 0;
        this.category.categoryName = name;
        this.service.AddCategory(this.category).subscribe(cat => {
          this.message = 'Category has been added successfully';
          this.catForm.reset();
        }, ex => {
          this.message = null;
          console.log(ex);
        })
      }
    }
  }

  GoToList() {
    sessionStorage.setItem('cat', 'cat');
    this.router.navigate(['/controlpanel']);
  }

}
