const bookshelf = []
const RENDER_EVENT = 'render-bookshelf'
const SAVED_EVENT = 'save-bookshelf'
const STORAGE_KEY = 'BOOKSHELF_APPS'

const containerModal = document.querySelector('.container-modal')
const closeModal = document.querySelector('.close-modal')
const submitForm = document.getElementById('inputBook')
const searchBookForm = document.getElementById('searchBook')
const searchQuery = document.getElementById('searchBookTitle')

document.addEventListener('DOMContentLoaded', function () {
  closeModal.addEventListener('click', function () {
    containerModal.classList.remove('show')
    document.querySelector('body').style.overflow = 'visible'
  })

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault()
    addBook()
  })

  searchBookForm.addEventListener('submit', function (event) {
    event.preventDefault()
    const bookList = document.querySelectorAll('.item')

    for (book of bookList) {
      const isMatchTheTitle = book.firstChild.firstChild.innerText
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())

      if (isMatchTheTitle) {
        book.style.display = 'block'
      } else {
        book.style.display = 'none'
      }
    }
  })

  if (isStorageExist()) {
    loadDataFromStorage()
  }
})

document.addEventListener(RENDER_EVENT, function () {
  const incompletedBookList = document.getElementById('incompleteBookshelfList')
  incompletedBookList.innerHTML = ''

  const completedBookList = document.getElementById('completeBookshelfList')
  completedBookList.innerHTML = ''

  for (const bookItem of bookshelf) {
    const bookElement = makeBook(bookItem)
    if (!bookItem.isComplete) incompletedBookList.append(bookElement)
    else completedBookList.append(bookElement)
  }
})

document.addEventListener(SAVED_EVENT, function () {
  localStorage.getItem(STORAGE_KEY)
})

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage')
    return false
  }
  return true
}

function getDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY)
  const data = JSON.parse(serializedData)

  return data
}

function loadDataFromStorage() {
  if (searchQuery.value == '') {
    bookshelf.length = 0
    const data = getDataFromStorage()

    if (data !== null) {
      for (const book of data) {
        bookshelf.push(book)
      }
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

function generateBookId() {
  return +new Date()
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  }
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value
  const authorName = document.getElementById('inputBookAuthor').value
  const publishYear = document.getElementById('inputBookYear').value
  const isChecked = document.getElementById('inputBookIsComplete').checked

  const generatedBookId = generateBookId()
  const bookObject = generateBookObject(
    generatedBookId,
    bookTitle,
    authorName,
    publishYear,
    isChecked
  )
  bookshelf.push(bookObject)

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function makeBook(bookObject) {
  const textBookTitle = document.createElement('h2')
  textBookTitle.innerText = bookObject.title

  const textAuthorName = document.createElement('p')
  textAuthorName.innerText = 'Penulis : ' + bookObject.author

  const textPublishYear = document.createElement('p')
  textPublishYear.innerText = 'Tahun Terbit : ' + bookObject.year

  const textContainer = document.createElement('div')
  textContainer.classList.add('inner')
  textContainer.append(textBookTitle, textAuthorName, textPublishYear)

  const container = document.createElement('div')
  container.classList.add('item')
  container.append(textContainer)
  container.setAttribute('id', `${bookObject.id}`)

  if (bookObject.isComplete) {
    const undoButton = document.createElement('button')
    undoButton.innerText = 'Tandai Belum Selesai Dibaca'

    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id)
    })

    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Hapus'

    deleteButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id)
    })

    container.append(undoButton, deleteButton)
  } else {
    const checkButton = document.createElement('button')
    checkButton.innerText = 'Tandai Selesai Dibaca'

    checkButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id)
    })

    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Hapus'

    deleteButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id)
    })

    container.append(checkButton, deleteButton)
  }
  return container
}

function findBook(bookId) {
  for (const bookItem of bookshelf) {
    if (bookItem.id === bookId) {
      return bookItem
    }
  }
  return null
}

function findBookIndex(bookId) {
  for (const index in bookshelf) {
    if (bookshelf[index].id === bookId) {
      return index
    }
  }
  return -1
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId)

  if (bookTarget == null) return

  bookTarget.isComplete = true
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId)

  if (bookTarget == null) return

  bookTarget.isComplete = false
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId)

  if (bookTarget === -1) return

  bookshelf.splice(bookTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  removeData()
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function removeData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
  openModal()
}

function openModal() {
  containerModal.classList.add('show')
  document.querySelector('body').style.overflow = 'hidden'
}
