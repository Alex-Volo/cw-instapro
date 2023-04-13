import { postImage } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { onAddPostClick } from "../api.js";
import {getToken} from "../index.js"
export function renderAddPostPageComponent({ appEl }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">

        <h3 class="form-title">Добавить пост</h3>

        <div class="form-inputs">
        
          <div class="upload-image-container">
                <div class="upload=image">
          
                  <label class="file-upload-label secondary-button">
                    <input type="file" class="file-upload-input" style="display:none">
                    Выберите фото
                  </label>
            
        
                </div>
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

    const imageContainer = document.querySelector('.upload-image-container');

    l({ element: imageContainer, urlChange: (imageUrl) => currentImageUrl = imageUrl, })
    function l({ element, urlChange }) {
      let imageUrl = "";
      const renderUploadImage = () => {

        element.innerHTML = `
          <div class="upload=image">

            ${imageUrl ? `
              <div class="file-upload-image-conrainer">
                <img class="file-upload-image" src="${imageUrl}">
                  <button class="file-upload-remove-button button">
                    Заменить фото
                  </button>
              </div>
              `
            : `
                <label class="file-upload-label secondary-button">
                    <input type="file" class="file-upload-input" style="display:none">Выберите фото
                </label>
                `
          }

          </div>`;

        const imageInput = element.querySelector(".file-upload-input");

        imageInput?.addEventListener("change", (() => {
          const imageFile = imageInput.files[0];

          if (imageFile) {
            const imageInputLabel = document.querySelector(".file-upload-label");
            imageInputLabel.setAttribute("disabled", !0),
              imageInputLabel.textContent = "Загружаю файл...",
              postImage(imageFile)
                .then(data => {
                  imageUrl = data.fileUrl,
                    urlChange(imageUrl),
                    renderUploadImage();
                })
          }
        }
        )),
          element.querySelector(".file-upload-remove-button")?.addEventListener("click", (() => {
            imageUrl = "",
              urlChange(imageUrl),
              renderUploadImage()
          }
          ))
      };

      renderUploadImage()
    }
    let currentImageUrl;
    document.getElementById("add-button").addEventListener("click", () => {
      const descriptionInput = document.querySelector('.input.textarea');
      onAddPostClick({
        description: descriptionInput.value,
        imageUrl: currentImageUrl,
        token: getToken(),
      })
    });

  };



  render();
}
