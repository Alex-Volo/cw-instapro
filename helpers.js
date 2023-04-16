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

export function validate(input) {
  if (input.value === '' || input.value === '\n') {
      input.classList.add('error');
      input.placeholder = 'Поле не может быть пустым!';
      input.value = '';
      setTimeout(() => {
          input.classList.remove('error')
          input.placeholder = ``;
      }, 1500);
  } else {
      return true;
  }
}
