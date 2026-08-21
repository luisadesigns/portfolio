/* ==========================================================
   PAGE LOGIC
   Handles: opening a project's popup when its card is clicked
   (see index.html for how each project's <template> is set
   up), switching between the Home/About tabs, revealing the
   email address on click, and keeping the "X projects" count
   in sync with however many project cards exist.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Grab the elements we need ----
  var page = document.getElementById('page');
  var overlay = document.getElementById('modal-overlay');
  var closeBtn = document.getElementById('modal-close');
  var modalScroll = document.getElementById('modal-scroll'); // scrollable content area inside the popup
  var cards = document.querySelectorAll('.card');
  var projectCountEls = document.querySelectorAll('.project-count'); // can appear in more than one place (header + About tab)
  var tabs = document.querySelectorAll('.tab');
  var revealEmailBtn = document.getElementById('reveal-email-btn');

  // ---- Keep every "X projects" number in sync with however many
  // .card thumbnails actually exist in the grid, so you never have
  // to update it by hand when adding/removing one.
  // (This runs in the visitor's browser — it's just JS reading the
  // page, not a server — so it works fine on GitHub Pages.) ----
  projectCountEls.forEach(function (el) {
    el.textContent = cards.length;
  });

  // ---- TABS: clicking "Home" or "About" swaps which .tab-panel
  // is visible. This is a plain in-page content swap, not a
  // popup — no blur, no overlay. ----
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = 'tab-' + tab.getAttribute('data-tab'); // e.g. "tab-about"

      // update which tab looks active
      tabs.forEach(function (t) { t.classList.remove('tab-active'); });
      tab.classList.add('tab-active');

      // show the matching panel, hide the rest
      document.querySelectorAll('.tab-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });

  // ---- EMAIL REVEAL: clicking "View email address" swaps the
  // button for the real mailto link, using whatever is in the
  // button's data-email attribute in index.html. ----
  if (revealEmailBtn) {
    revealEmailBtn.addEventListener('click', function () {
      var email = revealEmailBtn.getAttribute('data-email');
      var link = document.createElement('a');
      link.href = 'mailto:' + email;
      link.textContent = email;
      link.className = 'about-email-link';
      revealEmailBtn.replaceWith(link);
    });
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
