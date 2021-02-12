let     viewID = "main";
let     MAP = null;
let     TOPIC = null;
let     SectionType = null;
let     currentSection;
let     url = "";
let     subSection = false;
let     adresses = [];
let     SUBTOPIC = null;
let     anchor = "";
let     extraBody;
let     navigator = [];
let     path = [];
let     current;

function SetCurrentSection(e){
    currentSection = $(e).parent().parent().attr('id');
    if ($(e).parent().attr('id') === 'extraBody'+currentSection){
        extraBody = true;
        currentSection = 'extraBody';
    }else{
        extraBody = false;
    }
}

function createSubsection(){
    subSection = true;
}

function deleteTopic(){
    PSAM.child(TOPIC.NAME).remove();

    $('#card-section').removeClass('hidden');
    $('#map-item').addClass('hidden');
}

function deleteSection(e){
    let element = $(e).parent().parent().attr('id');

    PSAM.child(TOPIC.NAME+'/SECTIONS').child(element).remove();
    displayTopic(TOPIC.ID);
}

function sectionToggle(e){
    if ($(e).hasClass('glyphicon-chevron-down')){
        $(e).removeClass('glyphicon glyphicon-chevron-down');
        $(e).addClass('glyphicon glyphicon-chevron-up');

        $(e).parent().parent().next().removeClass('hidden');
    } else {
        $(e).removeClass('glyphicon glyphicon-chevron-up');
        $(e).addClass('glyphicon glyphicon-chevron-down');

        $(e).parent().parent().next().addClass('hidden');
    }
}

function topicTypeClick(e){
    let     elementID = $(e).attr('id');
    $('.sectionType').removeClass('btn-success');
    $('.sectionType').addClass('btn-default');
    $(e).removeClass('btn-default');
    $(e).addClass('btn-success');

    SectionType = $(e).attr('id').substring(7);

    if (elementID === 'sectionImage'){
        $('#imageInput').trigger('click');
        $('#sectionContentItem').addClass('hidden');
    }else{
        $('#sectionContentItem').removeClass('hidden');
    }
}

function displayTopic(TopicID){
    for (let key in MAP) {
        if (MAP[key].ID === TopicID){
            TOPIC = MAP[key];
            break;
        }
    }
   
    $('#map-item').empty();

    $('#map-item').append(
        '<div>'+
            '<div class="'+TOPIC.NAME+'" id="'+TOPIC.ID+'">'+
                '<div>'+
                    '<span class="glyphicon glyphicon-home" onclick="goHome()"></span>'+
                '</div>'+
                '<div class="spacer-smaller"></div>'+
                '<div class="text-center">'+
                    '<h2>'+TOPIC.NAME+'</h2>'+
                    '<span class="glyphicon glyphicon-trash" onclick="deleteTopic()"></span>'+
                '</div>'+
                '<div class="text-center">'+
                    '<h3>'+TOPIC.TITLE+'</h3>'+
                '</div>'+
                '<div class="spacer-smaller"></div>'+
                '<p>'+TOPIC.DESCRIPTION+'</p>'+
                '<div class="spacer-smaller"></div>'+
                '<div id="Body'+TOPIC.ID+'"></div>'+
                '<div class="spacer-smaller"></div>'+
                '<div id="extraBody'+TOPIC.ID+'" class="text-center">'+
                    '<span class="glyphicon glyphicon-plus" data-toggle="modal" data-target="#sectionContentModal" onclick="SetCurrentSection(this)"></span>'+
                '</div>'+
                '<div class="spacer-smaller"></div>'+
                '<div id="sections'+TOPIC.ID+'"></div>'+
                '<div class="spacer-small"></div>'+
                '<div class="text-center">'+
                    '<span class="btn btn-success" data-toggle="modal" data-target="#sectionModal">ADD SECTION</span>'+
                '</div>'+
                '<div class="spacer-small"></div>'+
                '<div id="subsection'+TOPIC.ID+'"></div>'+
            '</div>'+
            '<div id="child'+TOPIC.ID+'">'+
            '</div>'+
        '</div>'
    );
    currentSection = $('#map-item');
    sectionDisplay(TOPIC, TOPIC.ID);
}

function sectionDisplay(DATA, DATAID){
    for (let key in DATA.SECTIONS){
        let     id = DATA.SECTIONS[key].ID;
        let     el = document.createElement("div");
        let     html = "";


        if (key === 'extraBody'){
            extraBodyDisplay(DATA.SECTIONS[key], 'Body'+DATAID);
        }else if (DATA.SECTIONS[key].TYPE !== 'SUB-SECTION'){
            html = (
                '<div class="row section-container">'+
                    '<div class="col col-xs-11">'+
                        '<h5>'+key+'</h5>'+
                    '</div>'+
                    '<div class="col col-xs-1">'+
                        '<span class="glyphicon glyphicon-chevron-down" onclick="sectionToggle(this)"></span>'+
                    '</div>'+
                '</div>'+
                '<div class="section-content hidden" id="'+key+'">'+
                    '<div id="'+id+'">'+
                    '</div>'+
                    '<div class="spacer-small"></div>'+
                    '<div class="text-center">'+
                        '<span class="glyphicon glyphicon-plus" data-toggle="modal" data-target="#sectionContentModal" onclick="SetCurrentSection(this)"></span>'+
                        '<span class="glyphicon glyphicon-trash" onclick="deleteSection(this)"></span>'+
                    '</div>'+
                    '<div class="spacer-small"></div>'+
                '</div>'
            );

            el.innerHTML = html;
            document.getElementById('sections'+DATA.ID).appendChild(el);
            sectionContentDisplay(DATA, id, key);
        } else {
            html = (
                '<div class="map-card" id="'+DATA.SECTIONS[key].NAME+'">'+
                    '<div class="card-main"><h3>'+DATA.SECTIONS[key].NAME+'</h3></div>'+
                    '<div class="card-footer text-center">'+
                        '<span class="glyphicon glyphicon-eye-open view-card-icon" id="view'+DATA.SECTIONS[key].ID+'" onclick="viewSubtopic(this)"></span>'+
                    '</div>'+
                '</div>'
            );

            el.innerHTML = html;
            document.getElementById('subsection'+DATA.ID).appendChild(el);
            sectionContentDisplay(DATA,id, key);
        }

        
    }
}

function extraBodyDisplay(DATA, id){
    for (let item in DATA){
        if (item !== "NAME"){
            if (DATA[item].TYPE === "Paragraph"){
                let     el = document.createElement("p");
                el.innerHTML = DATA[item].ITEM;
                document.getElementById(id).appendChild(el);
            }else if(DATA[item].TYPE === "Heading"){
                let     el = document.createElement("h4");
                el.innerHTML = DATA[item].ITEM;
                document.getElementById(id).appendChild(el);
            }else if(DATA[item].TYPE === "Ul"){
                let     el = document.createElement("li");
                el.innerHTML = DATA[item].ITEM;
                document.getElementById(id).appendChild(el);
            }else if(DATA[item].TYPE === "Image"){
                let     code = generateCode(5);
                let     img = ('<img id="'+code+'" class="carousel_images" width="100%">');

                document.getElementById(id).insertAdjacentHTML('beforeend', img);
                document.getElementById(code).src = DATA[item].ITEM;
            }
        }
    }
}

function sectionContentDisplay(DATA ,id, key){

    for (let item in DATA.SECTIONS[key]){
        if (item !== "NAME"){
            if (DATA.SECTIONS[key][item].TYPE === "Paragraph"){
                let     el = document.createElement("p");
                el.innerHTML = DATA.SECTIONS[key][item].ITEM;
                document.getElementById(id).appendChild(el);
            }else if(DATA.SECTIONS[key][item].TYPE === "Heading"){
                let     el = document.createElement("h4");
                el.innerHTML = DATA.SECTIONS[key][item].ITEM;
                document.getElementById(id).appendChild(el);
            }else if(DATA.SECTIONS[key][item].TYPE === "Ul"){
                let     el = document.createElement("li");
                el.innerHTML = DATA.SECTIONS[key][item].ITEM;
                document.getElementById(id).appendChild(el);
            }else if(DATA.SECTIONS[key][item].TYPE === "Image"){
                let     code = generateCode(5);
                let     img = ('<img id="'+code+'" class="carousel_images" width="100%">');

                document.getElementById(id).insertAdjacentHTML('beforeend', img);
                document.getElementById(code).src = DATA.SECTIONS[key][item].ITEM;
            }
        }
    }
}

function viewCard(e){
    viewID = (e.id).substring(4);
    if (viewID !== "main"){
        $('#card-section').addClass('hidden');
        $('#map-item').removeClass('hidden');
        navigator.push(e.id);
        path.push($(e).parent().parent().parent());
        displayTopic(viewID);
        
        urlBuilder($(e).parent().parent().attr('id'));
    }
}

function displaySubTopics(target){
    let     html = (
        '<div>'+
            '<div class="'+SUBTOPIC.NAME+'" id="'+SUBTOPIC.ID+'">'+
                '<div class="row">'+
                    '<div class="col col-xs-2">'+
                        '<span class="glyphicon glyphicon-home" onclick="goHome()"></span>'+
                    '</div>'+
                    '<div class="col col-xs-1">'+
                        '<span class="glyphicon glyphicon-arrow-left" onclick="goBack()"></span>'+
                    '</div>'+
                    '<div class="col col-xs-9"></div>'+
                '</div>'+
                '<div class="text-center">'+
                    '<h2>'+SUBTOPIC.NAME+'</h2>'+
                    '<span class="glyphicon glyphicon-trash" onclick="deleteTopic()"></span>'+
                '</div>'+
                '<div class="text-center">'+
                    '<h3>'+SUBTOPIC.TITLE+'</h3>'+
                '</div>'+
                '<div class="spacer-smaller"></div>'+
                '<p>'+SUBTOPIC.DESCRIPTION+'</p>'+
                '<div class="spacer-smaller"></div>'+
                '<div id="Body'+SUBTOPIC.ID+'"></div>'+
                '<div class="spacer-smaller"></div>'+
                '<div id="extraBody'+SUBTOPIC.ID+'" class="text-center">'+
                    '<span class="glyphicon glyphicon-plus" data-toggle="modal" data-target="#sectionContentModal" onclick="SetCurrentSection(this)"></span>'+
                '</div>'+
                '<div class="spacer-smaller"></div>'+
                '<div id="sections'+SUBTOPIC.ID+'"></div>'+
                '<div class="spacer-small"></div>'+
                '<div class="text-center">'+
                    '<span class="btn btn-success" data-toggle="modal" data-target="#sectionModal">ADD SECTION</span>'+
                '</div>'+
                '<div class="spacer-small"></div>'+
                '<div id="subsection'+SUBTOPIC.ID+'"></div>'+
            '</div>'+
            '<div id="child'+SUBTOPIC.ID+'">'+
            '</div>'+
        '</div>'
     );

    let     el = document.createElement("div");
    el.innerHTML = html;
    document.getElementById(target).appendChild(el);
    sectionDisplay(SUBTOPIC, SUBTOPIC.ID);
    current = document.getElementById(target);
}

function viewSubtopic(e){
    let parentID = $(e).parent().parent().parent().parent().parent().attr('id');
    let parent = document.getElementById(parentID);
    let ele = $(e).parent().parent().attr('id')

    if (adresses.length > 0){
        SUBTOPIC = SUBTOPIC.SECTIONS[ele];
    }else{
        SUBTOPIC = TOPIC.SECTIONS[ele];
    }
    navigator.push(e.id);
    adresses.unshift(parentID);
    $(parent).addClass('hidden');
    urlBuilder($(e).parent().parent().attr('id'));
    displaySubTopics('child'+parentID);

    path.push(parent);
}

function repopulateSUBTOPIC(){
    
}

function urlBuilder(Parent){
    if (url === "")
        url = url + Parent;
    else
        url = url + '/SECTIONS/' + Parent;
}

//DOCUMENT READY

(function(){
    const   btnPostConversation = document.getElementById("btnCreateTopic");
    const   btnPostSection = document.getElementById('btnCreateSection');
    const   btnPostSectionItem = document.getElementById('btnCreateSectionItem');

    btnPostSectionItem.addEventListener('click', e => {
        let     Item = $('#sectionContentItem').val();
        console.log(url);
        if (Item.length > 0){
            PSAM.child(url).child("SECTIONS").child(currentSection).push({
                ITEM: Item,
                TYPE: SectionType
            });
        }
        contentReload();
    });

    btnPostSection.addEventListener('click', e => {
        let     Name = $('#sectionName').val();

        if (Name.length > 0){
            if (SUBTOPIC === null){
                PSAM.child(TOPIC.NAME).child("SECTIONS").child(Name).set({
                    NAME: Name,
                    ID: randomString(15),
                    TYPE: "SECTION"
                });
            }else{
                PSAM.child(url+'/SECTIONS').child(Name).set({
                    NAME: Name,
                    ID: randomString(15),
                    TYPE: "SECTION"
                });
            }
            contentReload();
        }
    });

    btnPostConversation.addEventListener('click', e => {
        let     Name = $('#topic').val();
        let     Title = $('#title').val();
        let     Description = $('#conversation').val();

        if (Name.length > 0){
            if (subSection === true){
                let     Parent = TOPIC.NAME;

                PSAM.child(url+'/SECTIONS').child(Name).set({
                    NAME: Name,
                    TITLE: Title,
                    DESCRIPTION: Description,
                    ID: randomString(15),
                    TYPE: "SUB-SECTION",
                    PARENT: Parent
                });

                subSection = false;
            }else{
                PSAM.child(Name).set({
                    DESCRIPTION: Description,
                    NAME: Name,
                    TITLE: Title,
                    ID: randomString(10),
                    TYPE: "PARENT"
                });
            }
            contentReload();
        }
    });

    PSAM.on("value", function(snapshot) {
        MAP = snapshot.val();

        $("#cards").empty();

        for (let key in MAP) { 
            $("#cards").append(
                '<div class="map-card" id="'+MAP[key].NAME+'">'+
                    '<div class="card-main"><h3>'+MAP[key].NAME+'</h3></div>'+
                    '<div class="card-footer text-center">'+
                        '<span class="glyphicon glyphicon-eye-open view-card-icon" id="view'+MAP[key].ID+'" onclick="viewCard(this)"></span>'+
                    '</div>'+
                '</div>'
            );
            current = $('#cards');
        }
    }, function (error) {
        //console.log("Error: " + error.code);
    });

    let randomString = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789±!@#$%^&*()_+-=§`~,./<>?;':|";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}());

document.getElementById("imageInput").addEventListener("change", readFile);

function readFile() {
  
    if (this.files && this.files[0]) {
      
      var FR = new FileReader();
      
      FR.addEventListener("load", function(e) {
        document.getElementById("imagePreview").src       = e.target.result;
        document.getElementById("imageb64").innerHTML = e.target.result;
        document.getElementById("sectionContentItem").value = e.target.result;
      }); 
      
      FR.readAsDataURL( this.files[0] );
    }
    
}

let generateCode = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789±!@#$%^&*()_+-=§`~,./<>?;':|";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


// Reloads the whole map by deleting all the opened topic content
// The Cards in the card section are then displayed
function contentReload(){
    $('#map-item').empty();
    $('#card-section').removeClass('hidden');
    navigate();                                     //If intended location is not the root the navigate function will navigate to it
}

function navigate(){
    let     cc = navigator;
    navigator = [];
    adresses = [];
    url = '';

    for (i = 0; i < cc.length; i++){
        let     element = document.getElementById(cc[i]);
        element.click();
    }
}

function goHome(){
    navigator = [];
    contentReload();
}

function goBack(){
    navigator.pop();
    contentReload();
}