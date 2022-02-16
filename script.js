const form = document.querySelector('.form');
const formInputTitle = document.querySelector('.title');
const formInputAutor = document.querySelector('.autor');
const formInputCategorie = document.querySelector('.categorie');
const listItem = document.querySelector('.list-items');


//on créé un objet qui va nous permettre d'exploiter des données

let biblio = {
    
}

//boucler sur l'objet
function loadHTML (){
    if(!window.localStorage.getItem('data')) return;
    const data = JSON.parse(window.localStorage.getItem('data'));
    biblio = data;
    Object.keys(biblio).map(key => createHTML(biblio[key], key));
}

window.addEventListener('load', loadHTML);

form.addEventListener('submit', createItem);


function createItem(e){
    e.preventDefault();
    const timestamp = Date.now();
    biblio[timestamp] = {
        title : formInputTitle.value,
        autor : formInputAutor.value,
        categorie : formInputCategorie.value
    }
    // console.log(bilbio[timestamp]);
    createHTML(biblio[timestamp], timestamp);
    saveObj();
    this.reset(); 
}

function createHTML(objet, key){
    const html = `
    <span>${objet.title}</span>
    <span>${objet.autor}</span>
    <span>${objet.categorie}</span>
    <button name="favorite" class="favorite">${objet.checked ? '<img src="./img/favorite-star-full.svg" alt="star-full">' : '<img src="./img/favorite-star.svg" alt="star">'}</button>
    <button name="modify" class="modify"><img src="./img/button-modify.svg" alt="modify"></button>
    <button name="trash" class="trash">🗑️</button>`

    const li = document.createElement('li');
    li.classList.add('item');
    li.setAttribute('data-key', key);
    li.innerHTML = html;
    listItem.insertBefore(li, listItem.firstChild);

    li.children.trash.onclick = toBin;
    li.children.modify.onclick = createForm;
    li.children.favorite.onclick = favorite;
}

function toBin(){
    this.parentNode.remove();
    const key = this.parentNode.getAttribute('data-key');
    delete biblio[key];
    saveObj();
}

function createForm(){
    const formHTML = `
        <form class="form-modify">
            <input class="title-modify" type="text" placeholder="New Title"/>
            <input class="autor-modify" type="text" placeholder=" New Autor"/>
            <input class="categorie-modify" type="text" placeholder=" New Categorie"/>
            <button type="submit">Update</button>
        </form>
    `

    const key = this.parentNode.getAttribute('data-key');
    const li = document.createElement('li');
    li.classList.add('form-update');
    li.setAttribute('data-key', key);
    li.innerHTML = formHTML;
    listItem.insertBefore(li, listItem.firstChild);

    const formUpdate = document.querySelector('.form-modify');

    
    
    
    formUpdate.addEventListener('submit', update);

}
function update(e){
        e.preventDefault();
        const key = this.parentNode.getAttribute('data-key');
        const formInputNewTitle = document.querySelector('.title-modify');
        const formInputNewCategorie = document.querySelector('.categorie-modify');
        const formInputNewAutor = document.querySelector('.autor-modify');
        console.log(formInputNewTitle.value);
        console.log(biblio[key].title);
        if(!formInputNewTitle.value){
            formInputNewTitle.value = biblio[key].title
        }
        if(!formInputNewAutor.value){
            formInputNewAutor.value = biblio[key].autor
        }
        if(!formInputNewCategorie.value){
            formInputNewCategorie.value = biblio[key].categorie
        }
        biblio[key] = {
            title : formInputNewTitle.value,
            autor : formInputNewAutor.value,
            categorie : formInputNewCategorie.value
        }
        saveObj();
        this.parentNode.remove();
        listItem.innerHTML = "";
        loadHTML();
        
}

function favorite(){
    this.parentNode.classList.toggle('flip');
    this.innerHTML = this.innerHTML === '<img src="./img/favorite-star.svg" alt="star">' ? `<img src="./img/favorite-star-full.svg" alt="star-full">` : `<img src="./img/favorite-star.svg" alt="star">`;
    const key = this.parentNode.getAttribute('data-key');
    biblio[key].checked = !biblio[key].checked;
    saveObj();
}

function saveObj(){
    window.localStorage.setItem('data', JSON.stringify(biblio))
}
