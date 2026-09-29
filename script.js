'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const email = 'aakritipariyar64@gmail.com';
const menu = $('.menu-button');
const nav = $('#navigation');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
$$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
const themeButton = $('.theme-button');
function setTheme(theme) { document.body.dataset.theme = theme; themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`); $('meta[name="theme-color"]').content = theme === 'dark' ? '#17271f' : '#f5f4ee'; }
try { setTheme(localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light'); } catch { setTheme('light'); }
themeButton.addEventListener('click', () => { const theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(theme); try { localStorage.setItem('portfolio-theme', theme); } catch {} });
$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  let count = 0; $$('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if (!card.hidden) count++; });
  $('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}.`;
}));
const tabs = $$('[role="tab"]');
function activateTab(tab) { tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; $('#' + item.getAttribute('aria-controls')).hidden = !active; }); }
tabs.forEach((tab, index) => { tab.addEventListener('click', () => activateTab(tab)); tab.addEventListener('keydown', e => { let next; if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length]; if (e.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length]; if (e.key === 'Home') next = tabs[0]; if (e.key === 'End') next = tabs[tabs.length - 1]; if (next) { e.preventDefault(); activateTab(next); next.focus(); } }); });
const projects = {
 portfolio: { category: 'WEB DEVELOPMENT / PERSONAL PROJECT', title: 'Personal Portfolio', description: 'A personal website that brings together my background, projects, and interests in one considered digital experience.', sections: [['Starting point', 'My first portfolio was created with HTML and CSS for CS 201. This version builds on that foundation with a responsive layout and interactive features.'], ['What you can explore', 'Project filters, detailed project views, keyboard-accessible skill tabs, light and dark themes, and an email draft form.'], ['Tools', 'HTML, CSS, and JavaScript. The source is available on GitHub.']], url: 'https://github.com/AakritiPariyar/portfolio' },
 weather: { category: 'DATA ANALYSIS / COURSEWORK', title: 'Weather Data Analysis', description: 'A Python project exploring weather patterns with Pandas, introduced in my original portfolio.', sections: [['Focus', 'Using data analysis to look for patterns in everyday weather information.'], ['Portfolio note', 'The chart on this page is an illustrative graphic, not a display of measured project results. A dataset, notebook, and detailed findings are not currently published in this repository.'], ['Tools', 'Python and Pandas.']] },
 campus: { category: 'PRODUCT DESIGN / PROTOTYPE', title: 'UWGB Campus Navigator', description: 'A mobile app prototype exploring campus navigation at the University of Wisconsin–Green Bay.', sections: [['The idea', 'Explore how a mobile interface could help students find their way around campus.'], ['Current stage', 'An early prototype featured in my original portfolio. The map artwork here illustrates the concept; it is not an accurate campus map or a live navigation service.'], ['Focus', 'Mobile experiences and clear, useful information.']] }
};
const dialog = $('#project-dialog');
let projectTrigger;
$$('.project-open').forEach(button => button.addEventListener('click', () => { const project = projects[button.dataset.project]; projectTrigger = button; $('#dialog-category').textContent = project.category; $('#dialog-title').textContent = project.title; $('#dialog-description').textContent = project.description; const details = $('#dialog-details'); details.replaceChildren(); project.sections.forEach(([heading, text]) => { const h = document.createElement('h3'); h.textContent = heading; const p = document.createElement('p'); p.textContent = text; details.append(h, p); }); const link = $('#dialog-link'); link.hidden = !project.url; if (project.url) link.href = project.url; else link.removeAttribute('href'); dialog.showModal(); document.body.style.overflow = 'hidden'; }));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; projectTrigger?.focus(); });
$('.copy-email').addEventListener('click', async () => { try { await navigator.clipboard.writeText(email); $('.copy-status').textContent = 'Email address copied.'; } catch { $('.copy-status').textContent = `Please copy this address: ${email}`; } });
$('#contact-form').addEventListener('submit', e => { e.preventDefault(); const name = $('#name').value.trim(); const reply = $('#email').value.trim(); const message = $('#message').value.trim(); if (!name || !message) { $('#form-status').textContent = 'Please add your name and a message.'; return; } const subject = encodeURIComponent(`Portfolio inquiry from ${name}`); const body = encodeURIComponent(`Hi Aakriti,\n\n${message}\n\n${name}\nReply to: ${reply}`); window.location.href = `mailto:${email}?subject=${subject}&body=${body}`; $('#form-status').textContent = 'Email draft requested. If your email app did not open, use the email address on this page. Your message has not been sent.'; });
$('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 }); $$('.reveal').forEach(section => observer.observe(section)); document.documentElement.classList.add('motion-ready'); const sectionObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { $$('.nav-links a').forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); } }); }, { rootMargin: '-15% 0px -55% 0px' }); $$('main section[id]').forEach(section => sectionObserver.observe(section)); }
