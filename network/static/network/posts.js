document.addEventListener('DOMContentLoaded', function () {
    
    let profile_flag =""
    
    previous = document.querySelector("#page-item-Previous2")
    next = document.querySelector("#page-item-Next2")
    var previous_link = previous.value;
    var next_link = next.value;
    console.log("new stuff " + previous_link + " next: "+ next_link)
    next.addEventListener('click', event => {
        if (current_user.length == 0) {}
        else {
        profile_flag=  document.querySelector('#profile-view').style.display ;
        console.log("profile_flag: "+profile_flag)
        }
        previous = document.querySelector("#page-item-Previous2").value
        next = document.querySelector("#page-item-Next2").value
        console.log("b: " + previous + "f: " + next)
        if(next != -1){
        document.querySelector("#posts-view").innerHTML = "";
        
        document.querySelector("#page-item-Previous2").value = previous + 1
        document.querySelector("#page-item-Next2").value = next + 1
        if (current_user.length == 0) {
            load_posts_visitor(`posts/${next}`);
        }
        else {
            if(profile_flag!="none"){
                let user_post = document.querySelector("#profile-id").innerHTML;
                console.log("profile id: "+user_post)
                load_posts(`user_posts/${next}/${user_post}`);
            }else{
                load_posts(`posts/${next}`);
            }          
        }
    }
    return false;
    });
    previous.addEventListener('click', event => {
        if (current_user.length == 0) {}
        else {
        profile_flag=  document.querySelector('#profile-view').style.display ;
        console.log("profile_flag: "+profile_flag)
        }
        console.log("profile_flag: "+profile_flag)
        previous = document.querySelector("#page-item-Previous2").value
        next = document.querySelector("#page-item-Next2").value
        console.log("b: " + previous + "f: " + next)
        if (previous>0){
        document.querySelector("#posts-view").innerHTML = "";
        
        document.querySelector("#page-item-Previous2").value = previous - 1
        document.querySelector("#page-item-Next2").value = next - 1
         
        if (current_user.length == 0) {
            load_posts_visitor(`posts/${previous}`);
        }
        else {
            if(profile_flag!="none"){
                let user_post = document.querySelector("#profile-id").innerHTML;
                console.log("profile id: "+user_post)
                load_posts(`user_posts/${previous}/${user_post}`);
            }else{
                load_posts(`posts/${previous}`);
            }    
        }
        }
        return false;
    });

    if (current_user.length == 0) {
        load_posts_visitor("posts/1");
    }
    else {
        console.log("full list")
        load_posts("posts/1");
    }

});

async function view_profile(user_post) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';
    //document.querySelector('#profile-view').innerHTML="profile!";
    const profile_anag = document.querySelector('#profile-view');
    const profile_img = document.querySelector('#profile-img');
    const profile_name = document.querySelector('#profile-name');
    const profile_follow = document.querySelector('#profile-follow');
    const profile_follow_button = document.querySelector('#profile-follow_button');
    console.log(user_post);
    let is_follower = false;
    await fetch(`/is_follower/${user_post}`)
        .then(response => response.text())
        .then(text => {
            var follower = JSON.parse(text);
            for (var i in follower) {
                // console.log("fetch =>"+follower[i].follower + " type: "+typeof(follower[i].follower))
                is_follower = follower[i].follower;
            }
        });
    let followers = "";
    let followed = "";

    fetch(`/get_profile/${user_post}`)
        .then(response => response.text())
        .then(text => {
            var profile = JSON.parse(text);
            for (var i in profile) {
                profile_img.src = profile[i].picture
                profile_img.style.width = "100px"
                profile_img.style.margin = "5px"
                followers = profile[i].followers;
                followed = profile[i].followed;
                profile_name.innerHTML = `Nome: ${profile[i].profile_name}`
                profile_follow.innerHTML = `Followers: ${profile[i].followers}<br>
            Followed: ${profile[i].followed}
            `;
                if (profile[i].profile_name === current_user) {
                    profile_follow_button.style.display = 'none';
                } else {
                    // console.log(typeof(is_follower)+ " => "+ is_follower)
                    if (is_follower) {

                        profile_follow_button.text = "Unfollow"
                    } else {
                        profile_follow_button.text = "Follow"
                    }
                }
                // console.log(profile[i].profile_name);   
            }
        });
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector("#profile-id").innerHTML=user_post;
    load_posts(`user_posts/1/${user_post}`);

    profile_follow_button.addEventListener('click', event => {
        if (profile_follow_button.text === "Unfollow") {
            // console.log("remove  follower")
            fetch(`/remove_follower/${user_post}`, {
                method: 'PUT',
                headers: { 'X-CSRFToken': csrftoken },
                mode: 'same-origin',
                body: JSON.stringify({
                    csrfmiddlewaretoken: csrftoken
                })
            }).then(response => {
                return response.text()
            }).then(data =>
                // this is the data we get after putting our data,
              console("")
            );
            profile_follow_button.text = "Follow"
            const profile_follow_tmp = document.querySelector('#profile-follow');
            followers = followers - 1;
            profile_follow_tmp.innerHTML = `Followers: ${followers}<br>
                Followed: ${followed}
                `;
            console.log(profile_follow_tmp.innerHTML)
        }
        else {
            // console.log("add follower")
            fetch(`/add_follower/${user_post}`, {
                method: 'PUT',
                headers: { 'X-CSRFToken': csrftoken },
                mode: 'same-origin',
                body: JSON.stringify({
                    csrfmiddlewaretoken: csrftoken
                })
            }).then(response => {
                return response.text()
            }).then(data =>
                // this is the data we get after putting our data,
                console.log("")
            );
            profile_follow_button.text = "Unfollow"
            const profile_follow_tmp = document.querySelector('#profile-follow');
            followers = followers + 1;
            profile_follow_tmp.innerHTML = `Followers: ${followers}<br>
              Followed: ${followed}
              `;
            //console.log(profile_follow_tmp.innerHTML)
        }
    });
    document.querySelector('#profile-view').style.display = 'block';
}

function edit_post(post_id) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    text_box = document.querySelector(`#text_box${post_id}`);
    text_area = document.createElement("textarea");
    save = document.createElement("a");
    discard = document.createElement("a");
    save.text = "Save";
    save.style.margin = "8px";
    save.href = "#";
    discard.text = "Discard";
    discard.href = "#";
    text_area.style.width = "80%";
    const message = text_box.innerHTML;
    text_box.innerHTML = "";
    text_area.value = message;
    text_box.append(text_area);
    text_box.append(save);
    text_box.append(discard);

    save.addEventListener('click', event => {
        console.log("saving");
        fetch(`/update_post/${post_id}`, {
            method: 'PUT',
            headers: { 'X-CSRFToken': csrftoken },
            mode: 'same-origin',
            body: JSON.stringify({
                csrfmiddlewaretoken: csrftoken,
                post: text_area.value
            })
        })
        text_box.innerHTML = text_area.value;
        text_box.removeChild(text_area);

    });

    discard.addEventListener('click', event => {
        console.log("disscard");
        text_box.innerHTML = message;
        text_box.removeChild(text_area);
    });

}
async function fetchLikes() {
    var my_likesR = [];
    await fetch("likes")
        .then(response => response.text())
        .then(text => {
            var like = JSON.parse(text);
            for (var i in like) {
                my_likesR.push(like[i].post_like);
                //console.log(like[i].post_like)
            }

        });
    return my_likesR;
}

async function load_posts_visitor(link) {
    let page = Number(link.match(/\d+/));
    document.querySelector('#posts-view').style.display = 'block';
    let total_records = 0;
    count_link= `/count_posts/0`

    await fetch(count_link)
    .then(response => response.text())
    .then(async text => {
        total_records = Number(text)
    }); 

    await fetch(link)
        .then(response => response.text())
        .then(async text => {
            var post = JSON.parse(text);
            var post_Count = JSON.parse(text).length
            var showed_records= page*3
            console.log("post count: " + post_Count);

            const previous = document.querySelector("#page-item-Previous2")
            const next = document.querySelector("#page-item-Next2")
            if (page < 2) {
               previous.classList.add("disabled")
            } else {
                previous.classList.remove("disabled")
            }

            if (total_records <= showed_records) {
                next.classList.add("disabled")
                next.value="-1"
            } else {
                next.classList.remove("disabled")
                next.value=page+1
            }


            for (var i in post) {
               // console.log(text)
                let post_id = post[i].id;
                let likes = post[i].tot_likes;
                let user_post = post[i].user_post;
                let avatar = "";
                console.log("post id: " + post_id + " user post: " + user_post)
                const post_box = document.createElement("div");
                const user_box = document.createElement("span");
                const text_box = document.createElement("div");
                text_box.margin = "5px";
                text_box.id = `text_box${post_id}`;

                user_avatar = document.createElement("img");
                user_avatar.style.margin = "5px";
                user_avatar.style.width = "40px"
                user_avatar.style.border = "1px solid gray"
                user_avatar.src = `${post[i].avatar}`;

                user_box.innerHTML = `${post[i].userN} <font style="font-size:12px"><i>on ${post[i].timestamp} wrote:</i></font>`;
                post_box.append(user_avatar)
                post_box.append(user_box);
                text_box.innerHTML = `${post[i].post}`;
                post_box.append(text_box);
                post_box.className = 'post_box';
                post_box.id = `post_box${post_id}`;
                post_box.style.border = "1px solid gray";
                post_box.style.borderRadius = "30px"
                post_box.style.margin = "5px"
                post_box.style.paddingLeft = "20px"
                post_box.style.paddingTop = "10px"

                //console.log(post_id)
                const likes_box = document.createElement("div");
                likes_box.style.paddingRight = "10px"
                likes_box.style.paddingBottom = "5px"
                likes_box.style.align = "right"
                likes_box.className = 'likes_box';
                likes_box.innerHTML = `<br><b>Likes:</b> ${likes}   `;
                post_box.append(likes_box)
                document.querySelector("#posts-view").append(post_box);

                likes_box.innerHTML = `<br>Likes: ${likes}   `;

            }


            console.log(text);
        });
}

async function load_posts(link) {

    let param_list = link.match(/\d+/g);
    let total_records = 0;
    let page = Number(param_list[0])
    console.log("link: " + link)
    console.log("page: " + page)
    if(param_list.length>1){
        count_link= `/count_posts/${param_list[1]}`
    }
    else {
        count_link= `/count_posts/0`
    }

        await fetch(count_link)
        .then(response => response.text())
        .then(async text => {
            total_records = Number(text)
        }); 
        console.log("total_records: " + total_records)
    if (link.toLowerCase().indexOf("user_") === -1) {

        //if(link === "posts/1"){
        document.querySelector('#form-post').style.display = 'block';
        document.querySelector('#posts-view').style.display = 'block';
        document.querySelector('#profile-view').style.display = 'none';
    } else {
        document.querySelector('#form-post').style.display = 'none';
        document.querySelector('#posts-view').innerHTML = "";
        document.querySelector('#posts-view').style.display = 'block';
        //document.querySelector('#profile-view').style.display = 'none';    
    }

    var my_likes = [];
    await fetchLikes().then(my_likesR => {
        my_likes = my_likesR; // fetched likes
    });

    await fetch(link)///////////////////////////////
        .then(response => response.text())
        .then(async text => {
           // console.log(text);
            var post = JSON.parse(text);
            var post_Count = JSON.parse(text).length
            var showed_records= page*3
            console.log("post count: " + post_Count);
            const previous = document.querySelector("#page-item-Previous2")
            const next = document.querySelector("#page-item-Next2")
            if (page < 2) {
               previous.classList.add("disabled")
            } else {
                previous.classList.remove("disabled")
            }

            if (total_records <= showed_records) {
                next.classList.add("disabled")
                next.value="-1"
            } else {
                next.classList.remove("disabled")
                next.value=page+1
            }

            for (var i in post) {
                let post_id = post[i].id;
                let likes = post[i].tot_likes;
                let user_post = post[i].user_post;
                let avatar = "";

                const post_box = document.createElement("div");
                const user_box = document.createElement("span");
                const text_box = document.createElement("div");
                text_box.margin = "5px";
                text_box.id = `text_box${post_id}`;

                user_avatar = document.createElement("img");
                user_avatar.style.margin = "5px";
                user_avatar.style.width = "40px"
                user_avatar.style.border = "1px solid gray"
                user_avatar.src = `${post[i].avatar}`;
                user_link = document.createElement("a");
                user_link.text = ` ${post[i].userN}`;

                user_link.style.margin = "8px";
                user_link.style.fontSize = "20px";
                user_link.style.fontWeight = "bold";
                user_link.style.color = "black";
                user_link.style.margin = "0px";
                user_link.href = "#";
                user_box.innerHTML = ` <font style="font-size:12px"><i>on ${post[i].timestamp} wrote:</i></font>`;
                const edit_link = document.createElement("div");
                edit_link.innerHTML = `<a href="#">Edit</a>`;
                // profile event listener 
                user_link.addEventListener('click', event => {
                    view_profile(user_post);
                    return false;
                });
                // retrieving user name 
                post_box.append(user_avatar)

                post_box.append(user_link)
                post_box.append(user_box);
                if (current_user === post[i].userN) {
                    text_box.innerHTML = `${post[i].post}`;
                    post_box.append(edit_link)
                    edit_link.addEventListener('click', event => {

                        edit_post(post_id);
                    });

                } else {
                    text_box.innerHTML = `${post[i].post}`;
                }

                post_box.append(text_box);
                post_box.className = 'post_box';
                post_box.id = `post_box${post_id}`;
                post_box.style.border = "1px solid gray";
                post_box.style.borderRadius = "30px"
                post_box.style.margin = "5px"
                post_box.style.paddingLeft = "20px"
                post_box.style.paddingTop = "10px"

                //console.log(post_id)
                const likes_box = document.createElement("div");
                likes_box.style.paddingRight = "10px"
                likes_box.style.paddingBottom = "5px"
                likes_box.style.align = "right"
                likes_box.className = 'likes_box';
                likes_box.innerHTML = `<br><b>Likes:</b> ${likes}   `;
                let I_like = my_likes.includes(post[i].id)
                //console.log(I_like)
                const like_button = document.createElement("button");
                like_button.className = 'btn btn-outline-info';
                let action_like = ""
                if (I_like === false) {
                    //like_button.textContent ="Like";
                    like_button.innerHTML = '<i class="fa fa-heart" style=" color: gray">';
                    //like_button.className = 'btn btn-primary';
                    //like_button.className = 'btn_like';
                    like_button.style.margin = "5px";
                    action_like = `/add_like/${post_id}`
                }
                else {
                    like_button.innerHTML = '<i class="fa fa-heart" style=" color: red">';
                    like_button.style.margin = "5px";
                    action_like = `/remove_like/${post_id}`
                }
                likes_box.prepend(like_button)
                post_box.append(likes_box)
                //post_box.append(like_button)

                document.querySelector("#posts-view").append(post_box);

                const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                like_button.addEventListener('click', event => { // like_button button 

                    fetch(action_like, {
                        method: 'PUT',
                        headers: { 'X-CSRFToken': csrftoken },
                        mode: 'same-origin',
                        body: JSON.stringify({
                            csrfmiddlewaretoken: csrftoken,
                            tot_likes: 1
                        })
                    })
                    if (I_like === false) {
                        likes = likes + 1
                        const index = my_likes.indexOf(post_id);
                        if (index > -1) { // only splice array when item is found
                            my_likes.splice(index, 1); // 2nd parameter means remove one item only
                        }
                        //like_button.textContent ="Unlike";
                        like_button.innerHTML = '<i class="fa fa-heart" style=" color: red">';
                        //like_button.className = 'btn btn-primary';
                        like_button.style.margin = "5px";
                        action_like = `/remove_like/${post_id}`
                        I_like = true
                    }
                    else {
                        likes = likes - 1
                        my_likes.push(post_id)
                        //like_button.textContent ="Like";
                        like_button.innerHTML = '<i class="fa fa-heart" style=" color: gray">';
                        //like_button.className = 'btn btn-primary';
                        like_button.style.margin = "5px";
                        action_like = `/add_like/${post_id}`
                        I_like = false
                    }
                    likes_box.innerHTML = `<br>Likes: ${likes}   `;
                    likes_box.prepend(like_button)
                    return false;
                });

            }
            //console.log(text);
        });
}  