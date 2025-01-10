const formCloseButton = document.querySelector("#form-close-btn");
const formDiv = document.querySelector(".book-info");
const addBookButton = document.querySelector("#add-btn");
const mainContainer = document.querySelector(".content");
const formSubmitButton = document.querySelector("#add-book-btn");
const TotalPages = document.querySelector("#total-pages");
const TotalBooks = document.querySelector("#total-books");
const TotalBooksRead = document.querySelector("#total-books-read");
const form = document.querySelector("#book-form");

formCloseButton.addEventListener("click", () => {
  formDiv.style.display = "none";
  mainContainer.classList.remove("blurred");
  form.reset();
});
addBookButton.addEventListener("click", () => {
  formDiv.style.display = "flex";
  mainContainer.classList.add("blurred");
});

formSubmitButton.addEventListener("click", () => {
  const bookTitle = document.getElementById("book-name").value.trim();
  const bookAuthor = document.getElementById("author-name").value.trim();
  const bookPages = document.getElementById("pages").value.trim();
  const bookRead = document.getElementById("read-status").checked;
  if (bookTitle === "" || bookAuthor === "" || bookPages === "") {
    alert("Please fill out all the fields");
    return;
  }
  const newBook = new Book(bookTitle, bookAuthor, bookPages, bookRead);
  newBook.addToHtml();
  formDiv.style.display = "none";
  mainContainer.classList.remove("blurred");
  form.reset();
});

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  addToHtml() {
    // Capitalize the first letter of each word for title and author
    this.title = this.title
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    this.author = this.author
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Create card element and append book details
    const card = document.createElement("div");
    card.classList.add("card");

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

    // Tool container with edit and delete buttons
    const toolContainer = document.createElement("div");
    toolContainer.classList.add("edit-tool-container");

    if (this.read) {
      const readStatusBtn = document.createElement("button");
      readStatusBtn.setAttribute("id", "card-read-status"); // Corrected method to set attribute
      const readStatusImg = document.createElement("img");
      readStatusImg.src = "./src/tick1.png";
      readStatusImg.setAttribute("id", "card-read-status-img");
      readStatusBtn.appendChild(readStatusImg);
      toolContainer.appendChild(readStatusBtn);
      TotalBooksRead.textContent = parseInt(TotalBooksRead.textContent) + 1;
    }

    const EditBtn = document.createElement("button");
    EditBtn.setAttribute("id", "edit-btn"); // Corrected method to set attribute
    const EditImg = document.createElement("img");
    EditImg.src = "./src/edit.png";
    EditImg.setAttribute("id", "edit-img");
    EditBtn.appendChild(EditImg);

    const DelBtn = document.createElement("button");
    DelBtn.setAttribute("id", "delete-btn"); // Corrected method to set attribute
    const DelImg = document.createElement("img");
    DelImg.src = "./src/cross.png"; // Corrected image reference for delete button
    DelImg.setAttribute("id", "delete-img");
    DelBtn.appendChild(DelImg);

    toolContainer.append(EditBtn, DelBtn); // Correctly append both buttons

    card.append(cardInfo, toolContainer);

    TotalBooks.textContent = parseInt(TotalBooks.textContent) + 1;
    TotalPages.textContent =
      parseInt(TotalPages.textContent) + parseInt(this.pages);

    mainContainer.appendChild(card);
  }
}
