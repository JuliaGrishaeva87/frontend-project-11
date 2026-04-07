import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
//import { setupCounter } from './counter.js'
import './style.scss'
import 'bootstrap'

document.querySelector('#app').innerHTML = `
<section id="inputField">
      <h1>RSS агрегатор</h1>
      <p>Начните читать RSS сегодня! Это легко, это красиво.</p>
      <div class="input">
        <label for=""></label>
        <input id="" type="text" name="" placeholder="Ссылка на RSS">
        <button type="submit">Добавить</button>
      </div>
      <span>Пример: https://lorem-rss.hexlet.app/feed</span>
    </section>
    <section id="outputField"></section>
`

//setupCounter(document.querySelector('#counter'))
