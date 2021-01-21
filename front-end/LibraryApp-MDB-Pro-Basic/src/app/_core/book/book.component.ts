import {Component, EventEmitter, OnInit} from '@angular/core';
import {BookImageUrlService} from '../../_services/book-image-url.service';
import {BookCategoryTypeService} from '../../_services/book-category-type.service';
import {BookService} from '../../_services/book.service';
import {ModalDirective} from 'ng-uikit-pro-standard';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthorService} from '../../_services/author.service';
import {BookCategory} from '../../model/BookCategory';
import {BookImageUrl} from '../../model/BookImageUrl';
import {AlertsService} from '../../_services/alerts.service';
import {Book} from 'src/app/model/Book';
import swal from 'sweetalert';
import {ReloadPageService} from '../../_services/reload-page.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  bookImages = [];
  bookCategories = [];
  fictionals = [];
  nonfictionals = [];
  books = [];
  authors = [];
  addBookForm: FormGroup;
  editBookForm: FormGroup;

  errorMessage = '';
  isErrorSelected = false;

  isFictional = false;
  isNonfictional = false;

  preSelectedTitle = '';

  constructor(private bookImageUrlService: BookImageUrlService,
              private bookCategoryTypeService: BookCategoryTypeService,
              private bookService: BookService,
              private authorService: AuthorService,
              private alertsService: AlertsService,
              private reloadPageService: ReloadPageService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.getAllBookImages();
    this.getAllBooks();
    this.getAllAuthors();
    this.getAllBookCategories();
    this.getAllFictionals();
    this.getAllNonfictionals();
    this.formBook();
  }

  formBook() {
    this.addBookForm = new FormGroup({
      title: new FormControl(''),
      author: new FormControl(''),
      stock: new FormControl('', Validators.required),
      bookImageUrl: new FormControl(''),
      bookCategory: new FormControl(''),
      fictional: new FormControl(),
      nonfictional: new FormControl()
    });
  }

  editFormBook(book: Book, modalDirective: ModalDirective) {

    const bookImageSelected = this.bookImages.find(i => i.id == book.bookImageUrl.id);
    const bookCategorySelected = this.bookCategories.find(i => i.id == book.bookCategory.id);
    const authorSelected = this.authors.find(i => i.id == book.author.id);

    this.editBookForm = new FormGroup({
      id: new FormControl(book.id),
      title: new FormControl(book.title),
      author: new FormControl(book.author),
      stock: new FormControl(book.stock),
      bookImageUrl: new FormControl(book.bookImageUrl),
      bookCategory: new FormControl(book.bookCategory),
      fictional: new FormControl(book.fictional),
      nonfictional: new FormControl(book.nonfictional)
    });

    this.editBookForm.get('author').setValue(authorSelected);
    this.editBookForm.get('bookImageUrl').setValue(bookImageSelected);
    this.editBookForm.get('bookCategory').setValue(bookCategorySelected);

    if (book.fictional != null) {
      const fictionalSelected = this.fictionals.find(i => i.id == book.fictional.id);
      this.editBookForm.get('fictional').setValue(fictionalSelected);
      this.isFictional = true;
      this.isNonfictional = false;

    }

    if (book.nonfictional != null) {
      const nonfictionalSelected = this.nonfictionals.find(i => i.id == book.nonfictional.id);
      this.editBookForm.get('nonfictional').setValue(nonfictionalSelected);
      this.isNonfictional = true;
      this.isFictional = false;
    }

    modalDirective.toggle();
  }

  getAllBookImages() {
    this.bookImageUrlService.getAllImageBook().subscribe((data: any) => {
        this.bookImages = data;
      },
      err => {
        this.bookImages = JSON.parse(err.message).message;
      }
    );
  }

  getAllAuthors() {
    this.authorService.getAllAuthors().subscribe((data: any) => {
      this.authors = data;
    }, error => {
      this.authors = JSON.parse(error.message).message;
    });
  }

  getAllBooks() {
    this.bookService.getAllBooks().subscribe((data: any) => {
      this.books = data;

      this.books.forEach((imageBook: any) => {
        imageBook.bookImageUrl.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${imageBook.bookImageUrl.imageUrl}`);
      });

    }, error => {
      this.books = JSON.parse(error.message).message;
    });
  }

  getAllBookCategories() {
    this.bookCategoryTypeService.getAllBookCategories().subscribe((data: any) => {
      this.bookCategories = data;
    }, error => {
      this.bookCategories = JSON.parse(error.message).message;
    });
  }

  getAllFictionals() {
    this.bookCategoryTypeService.getAllFictional().subscribe((data: any) => {
      this.fictionals = data;
    }, error => {
      this.fictionals = JSON.parse(error.message).message;
    });
  }

  getAllNonfictionals() {
    this.bookCategoryTypeService.getAllNonfictional().subscribe((data: any) => {
        this.nonfictionals = data;
      },
      error => {
        this.nonfictionals = JSON.parse(error.message).message;
      });
  }

  addBook(modalDirective: ModalDirective) {

    if (this.addBookForm.value.author == ''){
      this.addBookForm.get('author').setValue(null);
    }

    if (this.addBookForm.value.bookCategory == ''){
      this.addBookForm.get('bookCategory').setValue(null);
    }

    this.bookService.addBook(this.addBookForm.value).subscribe(response => {
        this.reloadPageService.reload();
        this.alertsService.success();
        modalDirective.toggle();
        this.isNonfictional = false;
        this.isFictional = false;
        this.isErrorSelected = false;
      },
      error => {
        this.errorMessage = error.error.message;
        this.isErrorSelected = true;
      });
  }

  updateBook(modalDirective: ModalDirective): void {
    const index = this.books.findIndex(book => book.id == this.editBookForm.value.id);
    this.books[index] = this.editBookForm.value;
    const id = this.books[index].id;

    this.bookService.editBookById(id, this.books[index]).subscribe(response => {
        this.reloadPageService.reload();
        this.alertsService.success();
        modalDirective.toggle();

      },
      err => {
        console.log(err);
      });
  }

  deleteBook(book: Book) {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this registration!',
      icon: 'warning',
      buttons: ['Cancel', 'Ok'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.bookService.deleteBookById(Number(book.id)).subscribe(response => {
              this.reloadPageService.reload();
              this.alertsService.warning();
            },
            error => {
              console.log(error);
            });
          swal('Your registration/file has been deleted!', {
            icon: 'success',
          });
        }
      });
  }

  isFictionalSelected(event: any) {
    if (event.nameOfBookCategory == 'Fiction') {
      this.isFictional = true;
      this.isNonfictional = false;
    }

    if (event.nameOfBookCategory == 'Nonfiction') {
      this.isFictional = false;
      this.isNonfictional = true;
    }
  }

  getPreSelectedTitle(event: any) {
    this.preSelectedTitle = event.title;
  }

}
