import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { fetchlike } from "../api.js";
import { correctUsersString } from "../helpers.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from 'date-fns/locale/';

export function renderPostsPageComponent({ appEl, isUser, token }) {

  const appHtml = `<div class="page-container center">
    <div class="header-container"></div>`
    +
    `${isUser ? `<div class="posts-user-header"><img src="${posts[0].user.imageUrl}"
     class="posts-user-header__user-image">
    <p class="posts-user-header__user-name">${posts[0].user.name}</p>
    </div>` : ''}`
    +

    `<ul class="posts">` +



    posts.reduce((result, post, index) => {
      return result + `
      <li class="post" data-index = "${index}">
      
        ${isUser ? '' : `<div class="post-header" data-user-id=${post.user.id}>
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${[post.user.name]}</p>
      </div>`}

        <div class="post-image-container">
          <img class="post-image" src=${post.imageUrl}>
        </div>

        <div class="post-likes">

          <button data-post-id=${post.id} class="like-button">
            <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
          </button>

          <p class="post-likes-text">
              Нравится: <strong>
              ${post.likes.length > 1 ? post.likes[0].name + ` и ещё ${correctUsersString(post.likes.length - 1)}`
          : post.likes.length ? post.likes[0].name
            : "0"}</strong>
          </p>
        </div>

        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>

        <p class="post-date">${formatDistanceToNow(new Date(post.createdAt), { locale: ru, addSuffix: true })}</p>
        
      </li>
    `
    }, '') +

    `</ul>
  </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let button of document.querySelectorAll(".like-button")) {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;
      const index = button.closest('.post').dataset.index;
      const currentButton = button;
      
      let isLiked = ''
      posts[index].isLiked ? isLiked = 1 : isLiked = 0;
      if (user) {
        currentButton.classList.add('like-animation');
        fetchlike({ token, postId, isLiked })
          .then(() => {
            if (isLiked) {
              posts[index].isLiked = false
              posts[index].likes.pop();
            } else {
              posts[index].isLiked = true;
              posts[index].likes.push({
                id: user._id,
                name: user.name
              });
            }

            renderPostsPageComponent({ appEl, isUser, token })
          })
      };

    });
  }
}
