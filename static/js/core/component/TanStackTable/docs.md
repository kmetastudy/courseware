## Pagination

### Page handle

```js
// first page
table.firstPage();

// last page
table.lastPage();

// previous page
table.previousPage();

// next page
table.nextPage();

// getCanPreviousPage
table.getCanPreviousPage();

// getCanNextPage
table.getCanNextPage();

// current page index
// 0부터 시작
table.pagination.getState().pageIndex;

// page 총 개수
table.getPageCount().toLocaleString();
table.getRowCount().toLocaleString(); // 이것도 되나?

// go to page with index
let page = 1;
table.setPageIndex(page);
```

### Page Size

보여지는 row의 개수이다.

```js
// get page size
table.getState().pagination.pageSize;
table.getRowModel().rows.length.toLocaleString(); // 이것도 되나?

// set page size
let pageSize = 10;
table.setPageSize(Number(pageSize));

// get page state
table.getState().pagination;
// result
{
  "pagination": 0,
  "pageSize": 20,
}
```
