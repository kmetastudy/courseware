export function PaginationUnit(options) {
  this.options = options
  this.elThis = null
  this.create()

}

PaginationUnit.prototype.create = function() {
  let paginationContainer = document.createElement("div")
  paginationContainer.classList.add('pagination-container')
  paginationContainer.classList.add('flex', 'justify-center', 'cursor-pointer')

  let numberButtonList = document.createElement("div")
  numberButtonList.classList.add('number-button-wrapper')
  numberButtonList.classList.add('px-2')

  paginationContainer.appendChild(numberButtonList)

  console.log(this)

  for (let i = 1; i <= this.options.page; i++) {
    let numberButton = document.createElement("span")
    numberButton.classList.add('number-button')
    numberButton.classList.add('px-2', 'hover:text-[#175CBE]')
    if(i == 1){
      numberButton.classList.add('text-[#175CBE]')
    }
    numberButton.textContent = i
    
    numberButton.addEventListener('click', this.onPageButtonClickHandler.bind(this))

    numberButtonList.append(numberButton)
  }


  let prevBtn = document.createElement("div")
  prevBtn.classList.add('prev-button')
  prevBtn.textContent = "이전"

  // numberButtonList.before(prevBtn)

  let nextBtn = document.createElement("div")
  nextBtn.classList.add('next-button')
  nextBtn.textContent = "이후"

  // numberButtonList.after(nextBtn)

  console.log(paginationContainer)
  this.elThis = paginationContainer
}

PaginationUnit.prototype.onPageButtonClickHandler = function(e) {
  this.options.onClick(e)
  document.querySelectorAll('.number-button').forEach(button => button.classList.remove('text-[#175CBE]'))
  e.target.classList.add('text-[#175CBE]')
}