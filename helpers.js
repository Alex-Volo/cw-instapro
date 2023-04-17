export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export function validate(input, placeholder = '') {
  if (input.value === '' || input.value === '\n') {
      input.classList.add('error');
      input.placeholder = 'Поле не может быть пустым!';
      input.value = '';
      setTimeout(() => {
          input.classList.remove('error')
          input.placeholder = placeholder;
      }, 1500);
  } else {
      return true;
  }
}

export function checkLogin(input, placeholder = ''){
  const pattern = /^[a-zа-я][a-zа-я0-9-_]*$/i;
  if(!pattern.test(input.value)){
    input.classList.add('error');
    input.placeholder = 'Поле не может содержать специальные символы, кроме "-" и "_"';
    input.value = '';
    setTimeout(() => {
        input.classList.remove('error')
        input.placeholder = placeholder;
    }, 1500);
  } else {
    return true;
  }
}

export function safeInput(string) {
   return str.replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
}
