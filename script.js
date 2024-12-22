const formCloseButton = document.querySelector("#form-close-btn");
const formDiv = document.querySelector(".book-info");
const addBookButton = document.querySelector("#add-btn");
const mainContainer = document.querySelector(".content");
const formSubmitButton = document.querySelector("#add-book-btn");
const bookTitle = document.querySelector("#book-name").value;
const bookAuthor = document.querySelector("#author-name").value;
const bookPages = document.querySelector("#pages").value;
const bookRead = document.querySelector("#read-status").value;

formCloseButton.addEventListener("click", () => {
  formDiv.style.display = "none";
  mainContainer.classList.remove("blurred");
});
addBookButton.addEventListener("click", () => {
  formDiv.style.display = "flex";
  mainContainer.classList.add("blurred");
});

formSubmitButton.addEventListener("click", () => {
  // if (bookTitle === "" || bookAuthor === "" || bookPages === "") {
  //   alert("Please fill out all the fields");
  //   return;
  // }
  mainContainer.appendChild(
    createBookCard(bookTitle, bookAuthor, bookPages, bookRead)
  );
  formDiv.style.display = "none";
  mainContainer.classList.remove("blurred");
});

function createBookCard(title, author, pages, read) {
  const card = document.createElement("div");
  card.classList.add("card");

  return card;
}
