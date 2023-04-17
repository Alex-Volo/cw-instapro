// "Alex-Volo" "prod"
const personalKey = "Alex-Volo";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

function responseHandler(response) {
  switch (response.status) {
      case 200:
        return response.json();

      case 201:
        return response.json();


      case 400:
        return response.json().then(json => {
          throw new Error(`Bad request: ${json.error}`)
        })

      case 500:
          throw new Error('Server is broken');
  }
}

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then(response => responseHandler(response))
    .then((data) => {
      return data.posts;
    });
}

export function getUserPosts({ token, id }) {
  return fetch(postsHost + '/user-posts/' + id, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
  .then(response => responseHandler(response))
  .then((data) => {
    return data.posts;
  });
}

export function onAddPostClick({ description, imageUrl, token }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      "description": description,
      "imageUrl": imageUrl,
    }),
  })
  .then(response => responseHandler(response))
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  })
  .then(response => responseHandler(response))
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then(response => responseHandler(response))
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then(response => responseHandler(response))
}

export function fetchlike({ token, postId, isLiked }) {
  {
    return fetch(postsHost + `/${postId}${isLiked ? '/dislike' : '/like'}`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    })
    .then(response => responseHandler(response))
  }
}