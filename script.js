// Select all necessary static elements
const formCloseButton = document.querySelector("#form-close-btn");
const formDiv = document.querySelector(".book-info");
const addBookButton = document.querySelector("#add-btn");
const mainContainer = document.querySelector(".content");
const formSubmitButton = document.querySelector("#add-book-btn");
const TotalPages = document.querySelector("#total-pages");
const TotalBooks = document.querySelector("#total-books");
const TotalBooksRead = document.querySelector("#total-books-read");
const form = document.querySelector("#book-form");

let editMode = false; // Flag to track whether the form is in edit mode
let bookToEdit = null; // Reference to the book being edited

// Close form
formCloseButton.addEventListener("click", () => {
  formDiv.style.display = "none";
  mainContainer.classList.remove("blurred");
  form.reset();
  editMode = false; // Reset edit mode
});

// Show form to add a new book
addBookButton.addEventListener("click", () => {
  formDiv.style.display = "flex";
  mainContainer.classList.add("blurred");
  form.reset(); // Clear form when adding a new book
  editMode = false; // Ensure we're not editing
});

// Submit form
formSubmitButton.addEventListener("click", () => {
  const bookTitle = document.getElementById("book-name").value.trim();
  const bookAuthor = document.getElementById("author-name").value.trim();
  const bookPages = document.getElementById("pages").value.trim();
  const bookRead = document.getElementById("read-status").checked;

  if (bookTitle === "" || bookAuthor === "" || bookPages === "") {
    alert("Please fill out all the fields");
    return;
  }

  if (editMode) {
    // Edit existing book
    bookToEdit.querySelector(".card-book-title").textContent = bookTitle;
    bookToEdit.querySelector(".card-author").textContent = "By " + bookAuthor;
    bookToEdit.querySelector(".card-pages").textContent = bookPages + " pages";

    // Update localStorage
    updateBookInLocalStorage(bookToEdit.dataset.id, {
      title: bookTitle,
      author: bookAuthor,
      pages: bookPages,
      read: bookRead,
    });
  } else {
    // Add new book
    const newBook = new Book(bookTitle, bookAuthor, bookPages, bookRead);
    newBook.addToHtml();
    saveBookToLocalStorage(newBook);
  }

  formDiv.style.display = "none";
  mainContainer.classList.remove("blurred");
  form.reset();
  editMode = false; // Reset edit mode after submission
});

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = Math.random().toString(36).substr(2, 9); // Generate a unique ID for the book
  }

  addToHtml() {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = this.id; // Attach the unique ID to the card

    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");

    const cardBookTitle = document.createElement("span");
    cardBookTitle.classList.add("card-book-title");
    cardBookTitle.textContent = this.title;

    const cardAuthor = document.createElement("span");
    cardAuthor.classList.add("card-author");
    cardAuthor.textContent = "By " + this.author;

    const cardPages = document.createElement("span");
    cardPages.classList.add("card-pages");
    cardPages.textContent = this.pages + " pages";

    cardInfo.append(cardBookTitle, cardAuthor, cardPages);

    const toolContainer = document.createElement("div");
    toolContainer.classList.add("edit-tool-container");

    if (this.read) {
      const readStatusBtn = document.createElement("button");
      readStatusBtn.setAttribute("id", "card-read-status");
      const readStatusImg = document.createElement("img");
      readStatusImg.src = "./src/tick1.png";
      readStatusImg.setAttribute("id", "card-read-status-img");
      readStatusBtn.appendChild(readStatusImg);
      toolContainer.appendChild(readStatusBtn);
      TotalBooksRead.textContent = parseInt(TotalBooksRead.textContent) + 1;
    }

    const EditBtn = document.createElement("button");
    EditBtn.classList.add("edit-btn"); // Use class instead of ID for multiple buttons
    const EditImg = document.createElement("img");
    EditImg.src = "./src/edit.png";
    EditImg.classList.add("edit-img");
    EditBtn.appendChild(EditImg);

    const DelBtn = document.createElement("button");
    DelBtn.classList.add("delete-btn"); // Use class instead of ID for multiple buttons
    const DelImg = document.createElement("img");
    DelImg.src = "./src/cross.png";
    DelImg.classList.add("delete-img");
    DelBtn.appendChild(DelImg);

    toolContainer.append(EditBtn, DelBtn);

    card.append(cardInfo, toolContainer);

    TotalBooks.textContent = parseInt(TotalBooks.textContent) + 1;
    TotalPages.textContent =
      parseInt(TotalPages.textContent) + parseInt(this.pages);

    mainContainer.appendChild(card);
  }
}

// Event delegation for Edit and Delete buttons
mainContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return; // Exit if no card is found

  // Handle Edit Button
  if (event.target.classList.contains("edit-img")) {
    const title = card.querySelector(".card-book-title").textContent;
    const author = card
      .querySelector(".card-author")
      .textContent.replace("By ", "");
    const pages = card
      .querySelector(".card-pages")
      .textContent.replace(" pages", "");

    // Determine the read status
    const isRead = !!card.querySelector("#card-read-status");

    // Populate form fields
    document.getElementById("book-name").value = title;
    document.getElementById("author-name").value = author;
    document.getElementById("pages").value = pages;
    document.getElementById("read-status").checked = isRead; // Update checkbox

    formDiv.style.display = "flex";
    mainContainer.classList.add("blurred");

    editMode = true; // Set edit mode
    bookToEdit = card; // Save reference to the book being edited
  }

  // Handle Delete Button
  if (event.target.classList.contains("delete-img")) {
    // Update totals
    const pages = parseInt(card.querySelector(".card-pages").textContent);
    TotalPages.textContent = parseInt(TotalPages.textContent) - pages;
    TotalBooks.textContent = parseInt(TotalBooks.textContent) - 1;

    if (card.querySelector("#card-read-status")) {
      TotalBooksRead.textContent = parseInt(TotalBooksRead.textContent) - 1;
    }

    // Remove from DOM
    card.remove();

    // Remove from localStorage
    removeBookFromLocalStorage(card.dataset.id);
  }
});

// Submit form
formSubmitButton.addEventListener("click", () => {
  // Retrieve form field values
  const bookTitle = document.getElementById("book-name")?.value?.trim();
  const bookAuthor = document.getElementById("author-name")?.value?.trim();
  const bookPages = document.getElementById("pages")?.value?.trim();
  const bookRead = document.getElementById("read-status")?.checked;

  // Debug: Log field values to verify correctness
  console.log("Book Title:", bookTitle);
  console.log("Book Author:", bookAuthor);
  console.log("Book Pages:", bookPages);

  // Validate inputs explicitly
  if (!bookTitle || !bookAuthor || !bookPages) {
    alert("Please fill out all the fields.");
    return;
  }

  if (editMode) {
    // Edit existing book
    const prevReadStatus = !!bookToEdit.querySelector("#card-read-status");

    bookToEdit.querySelector(".card-book-title").textContent = bookTitle;
    bookToEdit.querySelector(".card-author").textContent = "By " + bookAuthor;
    bookToEdit.querySelector(".card-pages").textContent = bookPages + " pages";

    // Update read status in UI
    if (bookRead && !prevReadStatus) {
      const readStatusBtn = document.createElement("button");
      readStatusBtn.setAttribute("id", "card-read-status");
      const readStatusImg = document.createElement("img");
      readStatusImg.src = "./src/tick1.png";
      readStatusImg.setAttribute("id", "card-read-status-img");
      readStatusBtn.appendChild(readStatusImg);
      bookToEdit.querySelector(".edit-tool-container").prepend(readStatusBtn);
      TotalBooksRead.textContent = parseInt(TotalBooksRead.textContent) + 1;
    } else if (!bookRead && prevReadStatus) {
      bookToEdit.querySelector("#card-read-status").remove();
      TotalBooksRead.textContent = parseInt(TotalBooksRead.textContent) - 1;
    }

    // Update localStorage
    updateBookInLocalStorage(bookToEdit.dataset.id, {
      title: bookTitle,
      author: bookAuthor,
      pages: bookPages,
      read: bookRead,
    });
  } else {
    // Add new book
    const newBook = new Book(bookTitle, bookAuthor, bookPages, bookRead);
    newBook.addToHtml();
    saveBookToLocalStorage(newBook);
  }

  // Close the form after successful submission
  formDiv.style.display = "none";
  mainContainer.classList.remove("blurred");
  form.reset();
  editMode = false; // Reset edit mode after submission
});

// Save book to localStorage
function saveBookToLocalStorage(book) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
}

// Update book in localStorage
function updateBookInLocalStorage(id, updatedData) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.map((book) =>
    book.id === id ? { ...book, ...updatedData } : book
  );
  localStorage.setItem("books", JSON.stringify(books));
}

// Remove book from localStorage
function removeBookFromLocalStorage(id) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.filter((book) => book.id !== id);
  localStorage.setItem("books", JSON.stringify(books));
}

// Load books from localStorage
function loadBooksFromLocalStorage() {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books.forEach((bookData) => {
    const book = new Book(
      bookData.title,
      bookData.author,
      bookData.pages,
      bookData.read
    );
    book.id = bookData.id; // Ensure ID is retained
    book.addToHtml();
  });
}

// Load books on page load
window.addEventListener("load", loadBooksFromLocalStorage);
