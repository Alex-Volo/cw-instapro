// Начало
/* 1. Интегрировать верстку списка постов 
   (рендер того, что пришло по GET запросу) +
   2. Возможность добавлять посты
      2.1. Сверстать страницу добавления постов +
      2.2. Подключить логику +
      2.3. Разобраться с uploadImage +
   3. Страница с постами конкретного юзверя
      3.1. Сделать функцию getUserPosts +
      3.2. Сделать renderApp +
   4. Реализовать возможность лайков
      4.1. Дата-тег +
      4.2. Функция на POST лайка +
      4.3. Функция на POST дизлайка +
      4.4. Логика переключения лайк/дизлайк и перерендер. +
      4.5. Перерисовать конкретную кнопку + 
      4.6. Счетчик лайков меняется. +
   5. Подключить dateFNS +
   6. Неавторизованный пользователь не может поставить лайк +

   7. Кэтч еррорс на всех запросах +
   8. Валидация при регистрации +
      8.1. логине +
      8.2. добавлении поста +
   9. HTML-теги не должны работать при вводе в любое из полей
   
   */

import { getPosts, getUserPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
let userId = '';

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getUserPosts({ token: getToken(), id: data.userId })
        .then((userPosts) => {
          page = USER_POSTS_PAGE;
          posts = userPosts;
          userId = data.userId;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
      // TODO: реализовать получение постов юзера из API

    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({ appEl, token: getToken() });
  }

  if (page === POSTS_PAGE) {
    let isUser = false;
    return renderPostsPageComponent({
      appEl,
      isUser,
      token: getToken()
    });
  }

  if (page === USER_POSTS_PAGE) {
    let isUser = true;
    // TODO: реализовать страницу фотографию пользвателя
    return renderPostsPageComponent({
      appEl,
      isUser,
      token: getToken()
    });
  }
};

goToPage(POSTS_PAGE);
