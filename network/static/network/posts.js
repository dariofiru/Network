document.addEventListener('DOMContentLoaded', function() {
     load_posts();
});
 


 function load_posts(){
    console.log("start");
    document.querySelector('#posts-view').style.display = 'block';
    // retrieve likes 
    var my_likes = [];
    fetch("likes")
    .then(response => response.text())
    .then(text => {
        var like = JSON.parse(text);
        for (var i in like){
            my_likes.push(like[i].post_like);
            console.log(like[i].post_like)
        }
        
    });
    //retrieve posts
    console.log(my_likes);

    fetch("posts")
    .then(response => response.text())
    .then(text => {
        var post = JSON.parse(text);
        for (var i in post){
            let post_id=post[i].id;
            let likes=post[i].tot_likes;

            const post_box =  document.createElement("div");
            post_box.innerHTML = `${post[i].id}<br>${post[i].user_post}<br>
            ${post[i].post}<br>`;
            post_box.className = 'post_box';
            post_box.id='post_box';
            post_box.style.border="1px solid black";
            post_box.style.padding="10px"
            console.log(post_id)
            const likes_box =  document.createElement("div");
            likes_box.style.padding="10px"
            likes_box.style.align="right"
            likes_box.className = 'likes_box';
            likes_box.innerHTML = `Likes: ${likes}`;
            let I_like = my_likes.includes(post[i].id)
            console.log(I_like)
            const like_button =  document.createElement("button");
            let action_like =""   
            if (I_like === false){
                 like_button.textContent ="Like";
                like_button.className = 'btn btn-primary';
                like_button.style.margin = "10px"; 
                action_like = `/add_like/${post_id}`
            }
            else {
                action_like = `/remove_like/${post_id}`
                like_button.textContent ="Unlike";
                like_button.className = 'btn btn-primary';
                like_button.style.margin = "10px"; 
            }
            
            document.querySelector("#posts-view").append(post_box);
            document.querySelector("#posts-view").append(likes_box);
            document.querySelector("#posts-view").append(like_button);
            
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            like_button.addEventListener('click', event => { // like_button button 
                console.log(post_id);
                console.log(likes);
                console.log(csrftoken);
                fetch(action_like, {
                    method: 'PUT',
                    headers: {'X-CSRFToken': csrftoken},
                    mode: 'same-origin',
                    body: JSON.stringify({
                        csrfmiddlewaretoken: csrftoken,
                      tot_likes: 1
                    })
                  })   
                  if (I_like === false){
                    likes=likes+1
                    const index = my_likes.indexOf(post_id);
                    if (index > -1) { // only splice array when item is found
                        my_likes.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    like_button.textContent ="Unlike";
                    like_button.className = 'btn btn-primary';
                    like_button.style.margin = "10px"; 
                    action_like = `/remove_like/${post_id}`
                    I_like = true
               }
               else {
                   likes=likes-1
                   my_likes.push(post_id)
                   like_button.textContent ="Like";
                   like_button.className = 'btn btn-primary';
                   like_button.style.margin = "10px";
                   action_like = `/add_like/${post_id}`
                   I_like = false 
               }
                  likes_box.innerHTML=likes 
                  return false;
            });
            //console.log(post);
        }
    });
}  