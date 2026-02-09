// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData, setData } from "./storage.js";



// We can access DOM elements here:
const userSelect = document.getElementById("userSelect");
const bookmarkSection = document.getElementById("bookmarks");
const form = document.getElementById("bookmarkForm");
const urlInput = document.getElementById("urlInput");
const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");



let currentUserId = null;

// Sort newest first
function sortedByNewest(bookmarks) {
  return [...bookmarks].sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

// Increase likes safely
function incrementLikes(bookmark) {
  return {
    ...bookmark,
    likes: bookmark.likes + 1
  };
}
// Here we are going to load the users into the dropdown menu

function loadUsers() {
  const users = getUserIds();

  users.forEach((id)=>{
    const option = document.createElement("option");
    option.value = id;
    option.innerText = id;
    userSelect.appendChild(option);
  });

  // We can set the current user to the first user in the list
  currentUserId = users[0];
  // We can set the dropdown menu to the current user
  userSelect.value = currentUserId;
}
  // we display the bookmarks for the current user

function displayBookmarks() {
  bookmarkSection.innerHTML = "";

  const data = getData(currentUserId) || [];

  // If there are no bookmarks, we can display a message
  if(data.length === 0) {
    bookmarkSection.innerText = "No bookmarks yet";
    return;
  }

  const sorted = sortedByNewest(data);

  sorted.forEach((bookmark, index)=>{
    const article = document.createElement("article");

    const link = document.createElement("a");
    link.href = bookmark.url;
    link.textContent = bookmark.title;

    const description = document.createElement("p");
    description.textContent = bookmark.description;
    const time = document.createElement("small");
    time.textContent = new Date(bookmark.createdAt).toLocaleString();

    // here is for copy button
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy URL";
    copyBtn.addEventListener("click", async()=>{
       await navigator.clipboard.writeText(bookmark.url);
    });

    // here is for like and delete buttons
    const likeBtn = document.createElement("button");
     likeBtn.textContent = `❤️ ${bookmark.likes}`;
     likeBtn.addEventListener("click", ()=>{
      const update = incrementLikes(bookmark);
      data[index] = update;
      setData(currentUserId, data);
      displayBookmarks();
     });

     
     article.append(link, description, time, copyBtn, likeBtn);
     bookmarkSection.append(article);
    });
  }

  // we can handle the user change event here
  userSelect.addEventListener("change", (event)=>{
    currentUserId = event.target.value;
    displayBookmarks();
  });

  // we can handle the form submission here
  form.addEventListener("submit", (event)=>{
    event.preventDefault();

    const newBookmark = {
      url: urlInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
      createdAt: Date.now(),
      likes: 0,
    };

    //Get existing bookmarks (or start empty)
    const existing = getData(currentUserId) || [];
      //Add the new bookmark and save
    setData(currentUserId, [...existing, newBookmark]);

    //Reset the form and update the display
    form.reset();
    displayBookmarks();
  });


  loadUsers();
  displayBookmarks();