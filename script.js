/* ==========================================================
   PROJECT POPUP LOGIC
   Handles: opening a project's popup when its card is clicked,
   filling the popup with the matching <template>'s content
   (see index.html for how those templates are set up), and
   closing the popup via the X button, clicking outside it, or
   pressing Escape.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Grab the elements we need ----
  var page = document.getElementById('page');
  var overlay = document.getElementById('modal-overlay');
  var closeBtn = document.getElementById('modal-close');
  var modalScroll = document.getElementById('modal-scroll'); // scrollable content area inside the popup
  var cards = document.querySelectorAll('.card');
  var projectCountEl = document.getElementById('project-count');

  // ---- Keep the "X projects" number in the header in sync with
  // however many .card thumbnails actually exist in the grid, so
  // you never have to update it by hand when adding/removing one.
  // (This runs in the visitor's browser — it's just JS reading the
  // page, not a server — so it works fine on GitHub Pages.) ----
  if (projectCountEl) {
    projectCountEl.textContent = cards.length;
  }

  // ---- Open the popup, filled with one card's matching <template> ----
  function openModal(card) {
    var templateId = card.getAttribute('data-modal');   // e.g. "modal-1"
    var template = document.getElementById(templateId);
    if (!template) { return; } // safety check in case an id typo happens

    modalScroll.innerHTML = '';                          // clear whatever was shown before
    modalScroll.appendChild(template.content.cloneNode(true)); // clone the template's content in
    modalScroll.scrollTop = 0;                           // always start scrolled to the top

    overlay.classList.add('open');   // shows the popup (see .modal-overlay.open in styles.css)
    page.classList.add('blurred');   // blurs everything behind it
    document.body.style.overflow = 'hidden'; // stop background scrolling while open
  }

  // ---- Close the popup ----
  function closeModal() {
    overlay.classList.remove('open');
    page.classList.remove('blurred');
    document.body.style.overflow = '';
  }

  // ---- Wire up every project card ----
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card);
    });
  });

  // ---- Close button ----
  closeBtn.addEventListener('click', closeModal);

  // ---- Click on the dark backdrop (outside the modal card) closes it ----
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // ---- Escape key closes it ----
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeModal();
    }
  });

});
