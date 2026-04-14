document.addEventListener("DOMContentLoaded", () => {
  // POPUP

  const popup = document.querySelector(".popup");
  const openButtons = document.querySelectorAll(".btn, .order-btn");
  const closeButton = document.querySelector(".popup-close");

  function openPopup() {
    if (!popup) return;
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (popup) {
    openButtons.forEach((btn) => {
      btn.addEventListener("click", openPopup);
    });

    closeButton?.addEventListener("click", closePopup);

    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });
  }

  // BURGER MENU

  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a");

  function closeMenu() {
    nav?.classList.remove("active");
    burger?.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("active");
      burger.classList.toggle("active");

      document.body.style.overflow = nav.classList.contains("active")
        ? "hidden"
        : "";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  // ESC (один listener)

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePopup();
      closeMenu();
    }
  });

  // HELPERS

  function showError(input, message) {
    input.classList.add("error");
    const errorText = input.parentElement.querySelector(".error-text");
    if (errorText) errorText.textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll(".error").forEach((el) => {
      el.classList.remove("error");
    });

    form.querySelectorAll(".error-text").forEach((el) => {
      el.textContent = "";
    });

    const success = form.querySelector(".form-success");
    if (success) success.textContent = "";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // UNIVERSAL FORM HANDLER

  function handleForm(form, options = {}) {
    if (!form) return;

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');
    const successText = form.querySelector(".form-success");
    const submitBtn = form.querySelector(".form-btn");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      clearErrors(form);

      let isValid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, "Введіть ім'я");
        isValid = false;
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, "Введіть email");
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, "Некоректний email");
        isValid = false;
      }

      if (messageInput && !messageInput.value.trim()) {
        showError(messageInput, "Введіть повідомлення");
        isValid = false;
      }

      if (!isValid) return;

      submitBtn.disabled = true;

      const params = new URLSearchParams({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput?.value.trim() || "",
      });

      // mock request (нет реального backend)
      fetch(`https://example.com/?${params}`, {
        method: "GET",
      })
        .then(() => {
          successText.textContent = "Форма успішно відправлена!";
          form.reset();

          if (options.closePopup) {
            setTimeout(closePopup, 1000);
          }
        })
        .catch(() => {
          successText.textContent = "Форма успішно відправлена!";
        })
        .finally(() => {
          submitBtn.disabled = false;
        });
    });
  }

  // INIT FORMS

  const popupForm = document.querySelector(".popup-form");
  const contactsForm = document.querySelector(".contacts-form form");

  handleForm(contactsForm);
  handleForm(popupForm, { closePopup: true });
});
