document.addEventListener('DOMContentLoaded', function() {
     load_posts();
});


 async function fetchLikes() {
    var my_likesR = [];
    await  fetch("likes")
    .then(response => response.text())
    .then(text => {
        var like = JSON.parse(text);
        for (var i in like){
            my_likesR.push(like[i].post_like);
            //console.log(like[i].post_like)
        }
        
    });
    return my_likesR;
}
 
async function load_posts(){
     
    document.querySelector('#posts-view').style.display = 'block';
     console.log(current_user);
    var my_likes = [];
    await  fetchLikes().then(my_likesR => {
        my_likes= my_likesR; // fetched movies
      });

   
    fetch("posts")
    .then(response => response.text())
    .then(text => {
        var post = JSON.parse(text);
        for (var i in post){
            let post_id=post[i].id;
            let likes=post[i].tot_likes;
            const post_box =  document.createElement("div");
            const user_box =  document.createElement("div");
            user_box.innerHTML=`<b><font style="font-size:20px">${post[i].userN}</font></b>
            <font style="font-size:12px"><i>on ${post[i].timestamp} wrote:</i></font>`;
            const edit_link =  document.createElement("div");
            edit_link.innerHTML=`<a href="#">Edit</a> `;
            // retrieving user name 
             
            if (current_user ===post[i].userN ){
                post_box.innerHTML = `${post[i].post}`;
                post_box.prepend(edit_link)
                
            }else {
                post_box.innerHTML = `${post[i].post}`;
            }
            post_box.prepend(user_box)
            
            post_box.className = 'post_box';
            post_box.id='post_box';
            post_box.style.border="1px solid gray";
            post_box.style.paddingLeft="20px"
            post_box.style.paddingTop="10px"

            //console.log(post_id)
            const likes_box =  document.createElement("div");
            likes_box.style.paddingRight="10px"
            likes_box.style.paddingBottom="5px"
            likes_box.style.align="right"
            likes_box.className = 'likes_box';
            likes_box.innerHTML = `<br><b>Likes:</b> ${likes}   `;
            let I_like = my_likes.includes(post[i].id)
            //console.log(I_like)
            const like_button =  document.createElement("button");
            like_button.className = 'btn btn-outline-info';
            let action_like =""   
            if (I_like === false){
                //like_button.textContent ="Like";
                like_button.innerHTML='<i class="fa fa-heart" style=" color: gray">'; 
                //like_button.className = 'btn btn-primary';
                //like_button.className = 'btn_like';
                like_button.style.margin = "5px"; 
                action_like = `/add_like/${post_id}`
            }
            else {
                like_button.innerHTML='<i class="fa fa-heart" style=" color: red">'; 
                //like_button.textContent ="Unlike";
                //like_button.className = 'btn btn-primary';
                //like_button.className = 'btn_like';
                like_button.style.margin = "5px"; 
                action_like = `/remove_like/${post_id}`
            }
            likes_box.prepend(like_button)
            post_box.append(likes_box)
           // post_box.append(like_button)
            document.querySelector("#posts-view").append(post_box);

            //document.querySelector("#posts-view").append(likes_box);
            //document.querySelector("#posts-view").append(like_button);
            
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            like_button.addEventListener('click', event => { // like_button button 

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
                    //like_button.textContent ="Unlike";
                    like_button.innerHTML='<i class="fa fa-heart" style=" color: red">'; 
                    //like_button.className = 'btn btn-primary';
                    like_button.style.margin = "5px"; 
                    action_like = `/remove_like/${post_id}`
                    I_like = true
               }
               else {
                   likes=likes-1
                   my_likes.push(post_id)
                   //like_button.textContent ="Like";
                   like_button.innerHTML='<i class="fa fa-heart" style=" color: gray">'; 
                   //like_button.className = 'btn btn-primary';
                   like_button.style.margin = "5px";
                   action_like = `/add_like/${post_id}`
                   I_like = false 
               }
                  likes_box.innerHTML=`<br>Likes: ${likes}   `;
                  likes_box.prepend(like_button)
                  return false;
            });
            console.log(post);
        }
    });
}  