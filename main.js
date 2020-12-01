// The current screen viewed by the user
// Certain button presses changes this variable
// It is used in the render function to determine what to display to the user
let currentView = "signup-or-login";
let pageErrorMessage = "";
let TOKEN = null;

const URL_FROM_GLITCH = "https://noiseless-creative-screw.glitch.me";

const loadMessages = () => {
  let container = document.createElement("div");

  fetch(URL_FROM_GLITCH + "/messages", {
    method: "GET",
  })
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      console.log("received from /messages  " + body);

      let parsed = JSON.parse(body);
      if (!parsed.success) {
        console.log("Failed to load messages");
      } else {
        // filter to exclude example message which is on index 0
        const messages = parsed.messages.filter((message, i) => i > 0);

        messages.forEach((message) => {
          const chatItem = document.createElement("p");
          chatItem.innerText = message.from + ": " + message.contents;

          container.appendChild(chatItem);
        });
      }
    });

  return container;
};

let signupOrLoginView = () => {
  //  You will need to modify this function
  let container = document.createElement("div");
  container.setAttribute("class", "container-vertically-centered");

  let loginButton = document.createElement("button");
  loginButton.innerText = "Login";
  loginButton.addEventListener("click", () => {
    currentView = "login";
    render();
  });

  let signupButton = document.createElement("button");
  signupButton.innerText = "Signup";
  signupButton.addEventListener("click", () => {
    currentView = "signup";
    render();
  });

  container.appendChild(signupButton);
  container.appendChild(loginButton);

  return container;
};

let errorView = () => {
  let container = document.createElement("div");
  container.setAttribute(
    "class",
    "container-vertically-centered container-contents-as-column"
  );

  let header = document.createElement("h1");
  header.innerText = pageErrorMessage;
  header.setAttribute("class", "header");

  let backHomeButton = document.createElement("button");
  backHomeButton.innerText = "Back to home";

  backHomeButton.addEventListener("click", () => {
    currentView = "signup-or-login";
    render();
  });

  container.appendChild(header);
  container.appendChild(backHomeButton);

  return container;
};

let signupView = () => {
  //  You will need to modify this function

  let container = document.createElement("div");
  container.setAttribute("class", "page-form");

  let header = document.createElement("h1");
  header.innerText = "Sign up";
  header.setAttribute("class", "header");

  let usernameFormGroup = document.createElement("div");
  usernameFormGroup.setAttribute("class", "form-group");

  let passwordFormGroup = document.createElement("div");
  passwordFormGroup.setAttribute("class", "form-group");

  let usernameLabel = document.createElement("label");
  usernameLabel.innerText = "Username";
  let usernameInput = document.createElement("input");

  let passwordLabel = document.createElement("label");
  passwordLabel.innerText = "Password";
  let passwordInput = document.createElement("input");

  let formActionGroup = document.createElement("div");
  formActionGroup.setAttribute("class", "form-group justify-content-center");

  let cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";

  cancelButton.addEventListener("click", () => {
    currentView = "signup-or-login";
    render();
  });

  let submitButton = document.createElement("button");
  submitButton.innerText = "Submit";

  submitButton.addEventListener("click", () => {
    let username = usernameInput.value;
    let password = passwordInput.value;

    // validate username and password
    if (username.trim().length < 1 || password.trim().length < 1) {
      currentView = "error-page";
      pageErrorMessage =
        "Signup failed. Reason: Username and Password cannot be empty";
      render();
      return;
    }

    // JSON.stringify converts a JavaScript value to a string
    let bodyToBeSent = JSON.stringify({ username, password });
    // fetch is covered in depth in the slides
    // You will need to replace PASTE_THE_URL_FROM_GLITCH with your glitch server url
    fetch(URL_FROM_GLITCH + "/signup", {
      method: "POST",
      body: bodyToBeSent,
    })
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        // putting a debugger statement here might be useful
        console.log("received from /signup  " + body);
        // JSON.parse converts a string to a JavaScript value
        // For this particular server, you always need to call it.
        let parsed = JSON.parse(body);
        if (!parsed.success) {
          // alert("signup not successful");
          currentView = "error-page";
          pageErrorMessage = "Sign up failed. Reason: " + parsed.reason;
          render();
        } else {
          alert("Signup successful");

          currentView = "login";
          render();
        }
      });
  });

  usernameFormGroup.appendChild(usernameLabel);
  usernameFormGroup.appendChild(usernameInput);

  passwordFormGroup.appendChild(passwordLabel);
  passwordFormGroup.appendChild(passwordInput);

  formActionGroup.appendChild(cancelButton);
  formActionGroup.appendChild(submitButton);

  container.appendChild(header);
  container.appendChild(usernameFormGroup);
  container.appendChild(passwordFormGroup);
  container.appendChild(formActionGroup);

  return container;
};

let loginView = () => {
  let container = document.createElement("div");
  container.setAttribute("class", "page-form");

  let header = document.createElement("h1");
  header.innerText = "Login";
  header.setAttribute("class", "header");

  let usernameFormGroup = document.createElement("div");
  usernameFormGroup.setAttribute("class", "form-group");

  let passwordFormGroup = document.createElement("div");
  passwordFormGroup.setAttribute("class", "form-group");

  let usernameLabel = document.createElement("label");
  usernameLabel.innerText = "Username";
  let usernameInput = document.createElement("input");

  let passwordLabel = document.createElement("label");
  passwordLabel.innerText = "Password";
  let passwordInput = document.createElement("input");

  let formActionGroup = document.createElement("div");
  formActionGroup.setAttribute("class", "form-group justify-content-center");

  let cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";

  cancelButton.addEventListener("click", () => {
    currentView = "signup-or-login";
    render();
  });

  let submitButton = document.createElement("button");
  submitButton.innerText = "Submit";

  submitButton.addEventListener("click", () => {
    let username = usernameInput.value;
    let password = passwordInput.value;

    let bodyToBeSent = JSON.stringify({ username, password });

    fetch(URL_FROM_GLITCH + "/login", {
      method: "POST",
      body: bodyToBeSent,
    })
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        console.log("received from /login  " + body);

        let parsed = JSON.parse(body);
        if (!parsed.success) {
          currentView = "error-page";
          pageErrorMessage = "Login failed. Reason: " + parsed.reason;
          render();
        } else {
          TOKEN = parsed.token;

          // render chat UI
          currentView = "chat";
          render();
        }
      });
  });

  usernameFormGroup.appendChild(usernameLabel);
  usernameFormGroup.appendChild(usernameInput);

  passwordFormGroup.appendChild(passwordLabel);
  passwordFormGroup.appendChild(passwordInput);

  formActionGroup.appendChild(cancelButton);
  formActionGroup.appendChild(submitButton);

  container.appendChild(header);
  container.appendChild(usernameFormGroup);
  container.appendChild(passwordFormGroup);
  container.appendChild(formActionGroup);

  return container;
};

let chatView = () => {
  let container = document.createElement("div");
  container.setAttribute("class", "chat-container");

  let topSection = document.createElement("div");
  topSection.setAttribute("class", "chat-top");

  let messagesSection = document.createElement("div");
  messagesSection.setAttribute("class", "chat-messages");

  let bottomSection = document.createElement("div");
  bottomSection.setAttribute("class", "chat-bottom");

  let refreshButton = document.createElement("button");
  refreshButton.innerText = "Refresh";
  refreshButton.addEventListener("click", () => {
    messagesSection.innerHTML = "";
    messagesSection.appendChild(loadMessages());
  });

  let messageInput = document.createElement("input");
  messageInput.setAttribute("class", "chat-message");

  let submitButton = document.createElement("button");
  submitButton.innerText = "Send message";
  submitButton.addEventListener("click", () => {
    if (messageInput.value.length < 1) {
      return;
    }

    let contents = messageInput.value;
    let token = TOKEN;

    let bodyToBeSent = JSON.stringify({ token, contents });

    fetch(URL_FROM_GLITCH + "/message", {
      method: "POST",
      body: bodyToBeSent,
    })
      .then((response) => {
        return response.text();
      })
      .then((body) => {
        console.log("received from /message  " + body);

        let parsed = JSON.parse(body);
        if (!parsed.success) {
          console.log("Sending message failed. Reason: " + parsed.reason);
          alert("Sending message failed. Reason: " + parsed.reason);
        } else {
          messageInput.value = ""; // empty the message input
          messageInput.select(); // focus on the message input
        }
      });
  });

  topSection.appendChild(refreshButton);
  bottomSection.appendChild(messageInput);
  bottomSection.appendChild(submitButton);

  container.appendChild(topSection);
  container.appendChild(messagesSection);
  container.appendChild(bottomSection);

  return container;
};

// Rerenders the page
let render = () => {
  // Will contain a reference
  let toRender = undefined;
  // For debugging purposes
  console.log("rendering view", currentView);
  if (currentView === "signup-or-login") {
    toRender = signupOrLoginView();
  } else if (currentView === "signup") {
    toRender = signupView();
  } else if (currentView === "login") {
    toRender = loginView();
  } else if (currentView === "chat") {
    toRender = chatView();
  } else if (currentView === "error-page") {
    toRender = errorView();
  } else {
    // woops
    alert("unhandled currentView " + currentView);
  }

  // Removes all children from the body
  document.body.innerHTML = "";
  document.body.appendChild(toRender);
};

// Initial render
render();
