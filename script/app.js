/*   LIB FOR  REQUESTS   */
(function () {
    "use strict";

    function get(url){
        let promise = new Promise(function(ok, nok){
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url);
            xmlHttp.onload = () => {
                let json = JSON.parse(xmlHttp.responseText);
                ok(json);
            };
            xmlHttp.onerror = () => {
                nok("Er is iet misgelopen, contacteer de administrator");
            };

            xmlHttp.send(null);
        });
        return promise;
    }
    window.http = {
        get: get
    };

})();

function SuperHero(name, picture, desc, com, ser, stor, event){
    this.Name = name;
    this.Picture = picture;
    this.Desc = desc;
    this.AmCommics = com;
    this.AmSeries = ser;
    this.AmStories= stor;
    this.AmEvents = event;
}

/*   FILL   */
(function(){
    document.addEventListener("DOMContentLoaded", init);

    function init(){

        loading();
        var Heroes = ["Spider-Man", "Captain America", "Iron Man", "Hulk", "Wolverine", "Thor", "Deadpool", "Wasp", "Thanos", "Black Widow", "Daredevil", "Black Panther"];
        getHeroes(Heroes);
    }

    function loading() {
        let loader = `<div class="loader_center"><div class="loader"></div></div>`;
        document.querySelector("#listCards").innerHTML = loader;
    }

    function getHeroes(Heroes) {
        var DetailHeroes = [];
        for (let i = 0, l = Heroes.length; i < l; i++) {
            var url = 'https://gateway.marvel.com:443/v1/public/characters?name=' + Heroes[i] + '&ts=1534779993&apikey=1b753008c7d9c33fe24f729c15189450&hash=ea0fdd3cedaa387c4aeb5e1c5d52c15e';
            http.get(url).then(function (response) {
                for (let e = 0, p = response.data.results.length; e < p; e++) {
                    let s = new SuperHero(
                        response.data.results[e].name,
                        response.data.results[e].thumbnail.path,
                        response.data.results[e].description,
                        response.data.results[e].comics.available,
                        response.data.results[e].series.available,
                        response.data.results[e].stories.available,
                        response.data.results[e].events.available
                    );
                    DetailHeroes.push(s);
                }
                if (DetailHeroes.length == Heroes.length){
                    render(DetailHeroes);
                }
            });
        }
    }

    function render(DetailHeroes){
        console.log("Renderen");
        let cards = ``;
        for(let i = 0, l = DetailHeroes.length; i<l; i++){

            var img = DetailHeroes[i].Picture + ".jpg";
            var desc ="";
            if (DetailHeroes[i].Desc == ""){
                desc = "~ NOT GIVEN ~"
            } else {
                desc = DetailHeroes[i].Desc.substring(0,75) + "...";
            }
            cards += `
            <div class="card_char" data-value="${i}">
                <div class="card_char_pic" style="background: url(${img}); background-size: cover; background-position: center">
                    <!--<img src="static/img/test.jpg">-->
                </div>
                <div class="card_char_info">
                    <h2 class="info_title">${DetailHeroes[i].Name}</h2>
                    <p class="info_desc">${desc}</p>
                    <button class="info_button">Show More</button>
                </div>
            </div>
            `;
        }
        document.querySelector("#listCards").innerHTML = cards;
        renderClickEvent(DetailHeroes);
    }

    function renderClickEvent(DetailHeroes) {
        var coll = document.getElementsByClassName("card_char");
        var i;
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                renderModal(DetailHeroes,this.getAttribute("data-value"));
            });
        }
    }

    function renderModal(DetailHeroes,val) {
        console.log(val);
        var modal = new tingle.modal({
            closeMethods: ['overlay', 'escape'],
            cssClass: ['custom-class-1', 'custom-class-2'],
            beforeOpen: function() {
                var img = DetailHeroes[val].Picture + ".jpg";
                var detailView = `
                    <h3>${DetailHeroes[val].Name}</h3>
                    <div class="model_content">
                        <img src="${img}" class="left">
                        <div class="right">
                            <p>${DetailHeroes[val].Desc}</p><br>
                            <ul>
                              <li>n° Comics: ${DetailHeroes[val].AmCommics}</li>
                              <li>n° Series: ${DetailHeroes[val].AmSeries}</li>
                              <li>n° Stories: ${DetailHeroes[val].AmStories}</li>
                              <li>n° Events: ${DetailHeroes[val].AmEvents}</li>
                            </ul>
                        </div>
                    </div>
                    `;
                modal.setContent(detailView);
            }
        });

        modal.open();
    }
})();
