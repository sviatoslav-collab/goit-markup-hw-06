(() => {
  const body = document.body;
  const menu = document.getElementById("mobile-menu");
  const menuOpenButton = document.querySelector(".menu-open-button");
  const menuCloseButton = document.querySelector(".mobile-menu-close-button");
  const modalBackdrop = document.getElementById("modal");
  const modalOpenButton = document.querySelector(".hero-button");
  const modalCloseButton = document.querySelector(".modal-close-button");
  const modalForm = document.querySelector(".modal-form");
  const subscribeForm = document.querySelector(".footer-subscribe-form");

  if (!menu || !menuOpenButton || !menuCloseButton || !modalBackdrop || !modalOpenButton || !modalCloseButton) {
    return;
  }

  let lastFocusedElement = null;

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  const updateScrollLock = () => {
    const hasOpenLayer = menu.classList.contains("is-open") || modalBackdrop.classList.contains("is-open");
    body.classList.toggle("is-scroll-locked", hasOpenLayer);
  };

  const getActiveLayer = () => {
    if (modalBackdrop.classList.contains("is-open")) {
      return modalBackdrop;
    }

    if (menu.classList.contains("is-open")) {
      return menu;
    }

    return null;
  };

  const moveFocusTo = element => {
    window.setTimeout(() => element.focus(), 0);
  };

  const openMenu = () => {
    if (menu.classList.contains("is-open")) {
      return;
    }

    lastFocusedElement = document.activeElement;
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    menuOpenButton.setAttribute("aria-expanded", "true");
    updateScrollLock();
    moveFocusTo(menuCloseButton);
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!menu.classList.contains("is-open")) {
      return;
    }

    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    menuOpenButton.setAttribute("aria-expanded", "false");
    updateScrollLock();

    if (restoreFocus) {
      moveFocusTo(menuOpenButton);
    }
  };

  const openModal = () => {
    if (modalBackdrop.classList.contains("is-open")) {
      return;
    }

    lastFocusedElement = document.activeElement;
    modalBackdrop.classList.add("is-open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    updateScrollLock();
    moveFocusTo(modalCloseButton);
  };

  const closeModal = ({ restoreFocus = true } = {}) => {
    if (!modalBackdrop.classList.contains("is-open")) {
      return;
    }

    modalBackdrop.classList.remove("is-open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    updateScrollLock();

    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      moveFocusTo(lastFocusedElement);
    }
  };

  const trapFocus = event => {
    const activeLayer = getActiveLayer();

    if (!activeLayer || event.key !== "Tab") {
      return;
    }

    const focusableElements = [...activeLayer.querySelectorAll(focusableSelector)].filter(
      element => element instanceof HTMLElement && element.offsetParent !== null,
    );

    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (!activeLayer.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement).focus();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  menuOpenButton.addEventListener("click", openMenu);
  menuCloseButton.addEventListener("click", closeMenu);
  modalOpenButton.addEventListener("click", openModal);
  modalCloseButton.addEventListener("click", closeModal);

  menu.querySelectorAll(".mobile-menu-navigation-link").forEach(link => {
    link.addEventListener("click", () => closeMenu({ restoreFocus: false }));
  });

  modalBackdrop.addEventListener("click", event => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (modalBackdrop.classList.contains("is-open")) {
        closeModal();
      } else if (menu.classList.contains("is-open")) {
        closeMenu();
      }
    }

    trapFocus(event);
  });

  modalForm?.addEventListener("submit", event => {
    event.preventDefault();
    modalForm.reset();
    closeModal();
  });

  subscribeForm?.addEventListener("submit", event => {
    event.preventDefault();
    subscribeForm.reset();
  });
})();
