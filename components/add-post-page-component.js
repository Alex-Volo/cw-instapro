import { renderHeaderComponent } from "./header-component.js";
import { onAddPostClick } from "../api.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { validate } from "../helpers.js";

export function renderAddPostPageComponent({ appEl, token }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">

        <h3 class="form-title">Добавить пост</h3>

        <div class="form-inputs">
        
          <div class="upload-image-container">
          </div>

          <label> Опишите фотографию:
            <textarea class="input textarea" rows="4"></textarea>
          </label>

          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange: (newImageUrl) => currentImageUrl = newImageUrl
    });
    
    let currentImageUrl = '';
    document.getElementById("add-button").addEventListener("click", () => {
      const descriptionInput = document.querySelector('.input.textarea');
      const imageInput = document.querySelector('.file-upload-input');
      
      if(!currentImageUrl) {
        alert('Добавьте изображение');
        return;
      }
      if(!validate(descriptionInput)) return;

      onAddPostClick({
        description: descriptionInput.value,
        imageUrl: currentImageUrl,
        token: token,
      })
      .then(() => goToPage(POSTS_PAGE))
      .catch((error) => {
        console.error(error);
        goToPage(POSTS_PAGE);
      });
    });

  };



  render();
}
