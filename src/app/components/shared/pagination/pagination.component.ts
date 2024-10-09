import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  currentPageInput: number = this.currentPage;

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onPageInputChange(): void {
    this.currentPageInput = +this.currentPageInput;

    if (
      this.currentPageInput >= 1 &&
      this.currentPageInput <= this.totalPages
    ) {
      this.pageChange.emit(this.currentPageInput);
    } else {
      this.currentPageInput = this.currentPage;
    }
  }
}
