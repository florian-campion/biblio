// delcaration des const (form, les inputs et la balise ul)
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
// quand on a un submit sur le formulaire contenu dans la const form
form.addEventListener('submit', createItem);


function createItem(e){
    // on empeche l'actualisation lors du submit du form
    e.preventDefault();
    // declaration de la const timestamps qui va permettre de recupérer les différentes entrées plus tard
    const timestamp = Date.now();
    // declaration de l'objet par rapport aux entrés des input du formulaire
    biblio[timestamp] = {
        title : formInputTitle.value,
        autor : formInputAutor.value,
        categorie : formInputCategorie.value
    }
    // appel de la fonction createHTML avec des paramètres 
    createHTML(biblio[timestamp], timestamp);
    // appel de la fonction saveobj pour stocker nos objet dans le local storage
    saveObj();
    //permet de reset les input du formulaire ciblé
    this.reset(); 
}

function createHTML(objet, key){
    // creation de la ligne en html qui va se retrouver dans la balise ul du html
    const html = `
    <span>${objet.title}</span>
    <span>${objet.autor}</span>
    <span>${objet.categorie}</span>
    <button name="favorite" class="favorite">${objet.checked ? '<img src="./img/favorite-star-full.svg" alt="star-full">' : '<img src="./img/favorite-star.svg" alt="star">'}</button>
    <button name="modify" class="modify"><img src="./img/button-modify.svg" alt="modify"></button>
    <button name="trash" class="trash">🗑️</button>`

    //creation de la balise li
    const li = document.createElement('li');
    // ajout de la classe item a la balise li
    li.classList.add('item');
    // on ajoute a la balise li data-key qui aura pour valeur (key)
    li.setAttribute('data-key', key);
    // on va ajouter notre html qu'on a créer plus haut dans cette balise li
    li.innerHTML = html;
    // on va insérer notre balise li en haut de notre liste
    listItem.insertBefore(li, listItem.firstChild);
    // appel des différentes fonction du bouton sur lequel on click
    li.children.trash.onclick = toBin;
    li.children.modify.onclick = createForm;
    li.children.favorite.onclick = favorite;
}

//fonction pour supprimer une balise li ciblé 
function toBin(){
    // on supprime la balise parent qui est donc la balise li
    this.parentNode.remove();
    // on recupère la key qui est sur la node parent 
    const key = this.parentNode.getAttribute('data-key');
    // on supprime l'objet correspondant à la clé (key) 
    delete biblio[key];
    // puis on sauvegarde nos changements
    saveObj();
}

// creation d'un nouveau formulaire pour pouvoir recupérer nos nouvelles entrées 
function createForm(){
    const formHTML = `
        <form class="form-modify">
            <input class="title-modify" type="text" placeholder="New Title"/>
            <input class="autor-modify" type="text" placeholder=" New Autor"/>
            <input class="categorie-modify" type="text" placeholder=" New Categorie"/>
            <button type="submit">Update</button>
            <button name="delete">X</button>
        </form>
    `
    // même chose que dans la fonction createHTML sauf qu'on recupère avant la clé (key) qui correspond à notre timestamp
    const key = this.parentNode.getAttribute('data-key');
    const li = document.createElement('li');
    li.classList.add('form-update');
    li.setAttribute('data-key', key);
    li.innerHTML = formHTML;
    listItem.insertBefore(li, listItem.firstChild);

    const formUpdate = document.querySelector('.form-modify');

    
    
    // appel de la fonction update sur le submit du formulaire de la constante formUpdate
    formUpdate.addEventListener('submit', update);

}
function update(e){
        // on empeche toujours l'actualisation pour éviter des problèmes
        e.preventDefault();
        // on n'oublie pas de récupérer la clé(key)
        const key = this.parentNode.getAttribute('data-key');
        // on déclare en const nos nouvelles inputs du formulaire
        const formInputNewTitle = document.querySelector('.title-modify');
        const formInputNewCategorie = document.querySelector('.categorie-modify');
        const formInputNewAutor = document.querySelector('.autor-modify');
        // on va venir verifier si nos inputs sont vide et si c'est le cas on reprend la valeur déja présente dans notre objet
        // pour éviter qu'elle soit remplacer par un champ vide
        if(!formInputNewTitle.value){
            formInputNewTitle.value = biblio[key].title
        }
        if(!formInputNewAutor.value){
            formInputNewAutor.value = biblio[key].autor
        }
        if(!formInputNewCategorie.value){
            formInputNewCategorie.value = biblio[key].categorie
        }
        // on remplace les valeurs de notre objet correspondant à la clé(key)
        biblio[key] = {
            title : formInputNewTitle.value,
            autor : formInputNewAutor.value,
            categorie : formInputNewCategorie.value
        }
        // on vient sauvegarder ces changements dans le local storafe
        saveObj();
        // on supprime le nouveau formulaire
        this.parentNode.remove();
        // on vient vider ce que contient notre balise ul 
        listItem.innerHTML = "";
        // puis on viens recharger nos donnés depuis le local storage pour éviter les doublons
        loadHTML();
        
}

// fonction qui ressemble a celle de check de notre projet todolist sauf qu'on vient remplacer les images 
function favorite(){
    this.parentNode.classList.toggle('flip');
    this.innerHTML = this.innerHTML === '<img src="./img/favorite-star.svg" alt="star">' ? `<img src="./img/favorite-star-full.svg" alt="star-full">` : `<img src="./img/favorite-star.svg" alt="star">`;
    const key = this.parentNode.getAttribute('data-key');
    biblio[key].checked = !biblio[key].checked;
    saveObj();
}

// function pour sauvegarder nos donnés dans le local storage
function saveObj(){
    window.localStorage.setItem('data', JSON.stringify(biblio))
}
