let     inputMessage = document.getElementById('inputMessage');
const   btnSend = document.getElementById('btnSend');


btnSend.addEventListener('click', e => {
    if (inputMessage.value.length > 0){
        FORUM.push({
            message: inputMessage.value,
            user: "ADMIN"
        });
    }
});

FORUM.on("value", function(snapshot) {
    let     Discussion = snapshot.val();
    
    if (Discussion){
        $('#displayArea').empty();
        for (let key in Discussion){
            let     Post = (
                '<div class="row">'+
                    '<div class="col col-xs-3">'+Discussion[key].user+'</div>'+
                    '<div class="col col-xs-9">'+Discussion[key].message+'</div>'+
                '</div>'
            );
            document.getElementById('displayArea').insertAdjacentHTML('beforeend', Post);
        }
    }
});


