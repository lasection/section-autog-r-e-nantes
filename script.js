const sampleSchedule = {
  1: [
    { start: '09:00', end: '10:30', title: 'Culture artistique', room: 'Salle A · Bâtiment principal', type: 'Cours', color: 'peach' },
    { start: '11:00', end: '12:30', title: 'Atelier de création', room: 'Atelier 2', type: 'Atelier', color: 'lilac' },
    { start: '14:00', end: '16:00', title: 'Méthodologie de projet', room: 'Salle B · Bâtiment principal', type: 'Cours', color: 'blue' }
  ],
  2: [
    { start: '09:30', end: '12:00', title: 'Pratique plastique', room: 'Atelier 1', type: 'Atelier', color: 'green' },
    { start: '13:30', end: '15:00', title: 'Histoire des arts', room: 'Salle A · Bâtiment principal', type: 'Cours', color: 'peach' }
  ],
  3: [
    { start: '10:00', end: '12:00', title: 'Expression et communication', room: 'Salle C · Bâtiment principal', type: 'Cours', color: 'blue' },
    { start: '14:00', end: '17:00', title: 'Projet personnel', room: 'Atelier 2', type: 'Projet', color: 'lilac' }
  ],
  4: [
    { start: '09:00', end: '10:30', title: 'Culture artistique', room: 'Salle A · Bâtiment principal', type: 'Cours', color: 'peach' },
    { start: '11:00', end: '12:30', title: 'Outils numériques', room: 'Salle informatique', type: 'Atelier', color: 'green' },
    { start: '14:00', end: '16:00', title: 'Pratique plastique', room: 'Atelier 1', type: 'Atelier', color: 'green' }
  ],
  5: [
    { start: '09:30', end: '11:00', title: 'Histoire des arts', room: 'Salle B · Bâtiment principal', type: 'Cours', color: 'peach' },
    { start: '11:15', end: '12:30', title: 'Suivi de projet', room: 'Salle C · Bâtiment principal', type: 'Projet', color: 'lilac' }
  ]
};

const dayNames = ['LUN', 'MAR', 'MER', 'JEU', 'VEN'];
const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
let weekOffset = 0;
let selectedDay = null;

function mondayFor(offset) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekday = date.getDay() || 7;
  date.setDate(date.getDate() - weekday + 1 + offset * 7);
  return date;
}

function shortDate(date) {
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}

function renderSchedule() {
  const tabs = document.querySelectorAll('.day-tab');
  const list = document.getElementById('schedule-list');
  if (!tabs.length || !list) return;

  const monday = mondayFor(weekOffset);
  const today = new Date();
  const todayDay = today.getDay() === 0 ? 0 : today.getDay();
  if (selectedDay === null) selectedDay = (todayDay >= 1 && todayDay <= 5) ? todayDay : 1;

  const friday = new Date(monday);
  friday.setDate(friday.getDate() + 4);
  const range = document.getElementById('week-range');
  range.textContent = `Du ${shortDate(monday)} au ${shortDate(friday)} · Exemple de planning`;
  const todayLabel = document.getElementById('today-label');
  todayLabel.textContent = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(today);

  tabs.forEach((tab, index) => {
    const date = new Date(monday);
    date.setDate(date.getDate() + index);
    tab.querySelector('span').textContent = dayNames[index];
    tab.querySelector('strong').textContent = date.getDate();
    tab.classList.toggle('selected', selectedDay === index + 1);
    tab.setAttribute('aria-selected', selectedDay === index + 1 ? 'true' : 'false');
    tab.setAttribute('aria-label', `${dayNames[index]}, ${shortDate(date)}`);
  });

  const events = sampleSchedule[selectedDay] || [];
  if (!events.length) {
    list.innerHTML = '<div class="no-classes"><span>✳</span><div><strong>Pas de cours prévu</strong><p>Profitez-en pour souffler ou avancer sur vos projets.</p></div></div>';
    return;
  }
  list.innerHTML = events.map(event => `<article class="schedule-event"><div class="event-time"><strong>${event.start}</strong><span>${event.end}</span></div><span class="event-marker ${event.color}" aria-hidden="true"></span><div class="event-details"><div class="event-title-row"><h3>${event.title}</h3><span class="event-type ${event.color}">${event.type}</span></div><p><span aria-hidden="true">⌖</span> ${event.room}</p></div></article>`).join('');
}

document.querySelectorAll('.day-tab').forEach(tab => tab.addEventListener('click', () => {
  selectedDay = Number(tab.dataset.day);
  renderSchedule();
}));
document.getElementById('previous-week')?.addEventListener('click', () => { weekOffset -= 1; selectedDay = 1; renderSchedule(); });
document.getElementById('next-week')?.addEventListener('click', () => { weekOffset += 1; selectedDay = 1; renderSchedule(); });
document.getElementById('current-week')?.addEventListener('click', () => { weekOffset = 0; selectedDay = null; renderSchedule(); });
renderSchedule();

const filterButtons = document.querySelectorAll('.filter-chip');
const searchInput = document.getElementById('archive-search');
const archiveCards = [...document.querySelectorAll('.archive-card')];
let activeFilter = 'all';

function filterArchives() {
  if (!archiveCards.length) return;
  const query = (searchInput?.value || '').trim().toLocaleLowerCase('fr');
  let visibleCount = 0;
  archiveCards.forEach(card => {
    const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesQuery = !query || card.dataset.search.toLocaleLowerCase('fr').includes(query);
    const visible = matchesCategory && matchesQuery;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  document.getElementById('archive-count').textContent = visibleCount;
  document.getElementById('empty-state').hidden = visibleCount !== 0;
  filterButtons.forEach(button => button.classList.toggle('selected', button.dataset.filter === activeFilter));
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterArchives();
}));
searchInput?.addEventListener('input', filterArchives);
filterArchives();

document.querySelectorAll('.download-link').forEach(link => link.addEventListener('click', event => event.preventDefault()));

const menuButton = document.querySelector('.mobile-menu');
menuButton?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
});
