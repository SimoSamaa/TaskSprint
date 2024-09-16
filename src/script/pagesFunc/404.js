export default function notFound(cb) {
  document.head.childNodes[9].textContent = 'TaskSprint | 404';

  const existing404CSS = document.getElementById('not-found-css');
  if (existing404CSS) existing404CSS.remove();

  const link = document.createElement('link');
  link.id = 'not-found-css';
  link.rel = 'stylesheet';
  link.href = '../../style/notFound.css';
  document.head.appendChild(link);

  document.body.innerHTML = `
        <div class='not-found'>
          <img src='../../assets/logo-2.png'></img>
            <div class="content">
              <div>
              <h1>400</h1>
              <h1>Page not found</h1>
            </div>
          <button class='btn btn-blue go-back'>Go back</button>
          </div>
        </div>
      `;

  document.querySelector('.go-back').addEventListener(('click'), () => {
    if (typeof cb === 'function') cb();
  });
}