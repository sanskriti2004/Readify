const formCloseButton = document.querySelector("#form-close-btn");
const formDiv = document.querySelector(".book-info");
const addBookButton = document.querySelector("#add-btn");
const mainContainer = document.querySelector(".content");

formCloseButton.addEventListener("click", () => {
  formDiv.style.display = "none";
  mainContainer.classList.remove("blurred");
});
addBookButton.addEventListener("click", () => {
  formDiv.style.display = "flex";
  mainContainer.classList.add("blurred");
});
