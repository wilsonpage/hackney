/*global sequencer*/

var grid = document.querySelector('.js-grid');
var socket = window.io('/');

socket.on('found', function(data) {
  data.forEach(addApp);
});

socket.on('lost', function(data) {
  data.forEach(removeApp);
});

function addApp(app) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  var img = document.createElement('img');

  var manifest = app.manifest;
  var icon = manifest.icons && manifest.icons[0].src;
  img.src = `${app.base}/${icon}`;
  a.href = app.base;
  li.className = 'icon';
  li.dataset.id = app.base;
  li.style.opacity = 0;

  // sequencer.mutate(() => {
    li.appendChild(a);
    a.appendChild(img);
    grid.appendChild(li);
  // })

  // .then(() => sequencer.animate(li, () => {
    li.style.opacity = 1;
  // }));
}

function removeApp(app) {
  var icon = document.querySelector(`[data-id="${app.base}"]`);
  if (!icon) return;

  // sequencer.animate(icon, () => icon.style.opacity = 0);
  // sequencer.mutate(() => icon.remove());
  icon.remove();
}
