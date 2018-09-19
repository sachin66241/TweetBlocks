connect().then(function(){
  mainAcc=account.name;
  main();
})

function tweets(tweetIndex){     
        
    for (var index = 0; index < tweetIndex.length; index++) {
   
      getTable(tweetIndex[index], "tweettable").then(function(bal){

              var idiv1 = document.createElement('div');
              var idiv2 = document.createElement('div');
              var idiv3 = document.createElement('div');
              var input = document.createElement('textarea');
              var button = document.createElement('button');
              var replyButton = document.createElement('button');
              var likeButton = document.createElement('button');
      
              replyButton.innerHTML = "replies"
              button.innerHTML = "Comment";
              replyButton.id = "replybutton"
              input.id='comment'+bal.rows[0].tweetId;
              input.name = "post";
              input.maxLength = "100";
              input.style.width = 400;
              input.style.height = 25;

              val=0;
              var likedUsers=[];                    
              while(val<bal.rows[0].likes.length){
        
              likedUsers.push(bal.rows[0].likes[val]);
              val++
              }
              
              
              if(likedUsers.includes(mainAcc)){

                  likeButton.innerHTML="unlike";
                  likeButton.setAttribute('onclick','unlike('+bal.rows[0].tweetId+')');
              
              }
              
              else{
                  
                  likeButton.innerHTML="like";
                  likeButton.setAttribute('onclick','like('+bal.rows[0].tweetId+')');
              
              
              } 
             var xxx = input.value;
          
            replies=bal.rows[0].replies;
           
            if(replies.length>0){
              
           
              replyButton.setAttribute('onclick','replie('+bal.rows[0].tweetId+')');
           
              }
          
             button.setAttribute('onclick', 'comment('+bal.rows[0].tweetId+')');
            
              
              idiv1.innerHTML = bal.rows[0].msg;
              idiv2.innerHTML= convert(bal.rows[0].timestamp);
            
              
              iDiv.appendChild(idiv1);
              iDiv.appendChild(idiv2);
              iDiv.appendChild(idiv3);
              
              iDiv.appendChild(input);
              iDiv.appendChild(button);
              iDiv.appendChild(replyButton);
              iDiv.appendChild(likeButton);
        
              document.getElementsByTagName('body')[0].appendChild(iDiv);

            });

          }
        }
              


function replie(twId){

  getTable(twId, "tweettable").then(function(bal){

     for (let index = 0; index < bal.rows[0].replies.length; index++) {
           
      console.log(bal.rows[0].msg);
      document.getElementById("tweetInrply").innerHTML=bal.rows[0].msg;
          reply(bal.rows[0].replies[index]);
         
      }
    });
  }



function reply(replyIndex){

  document.getElementById("rplContent").innerHTML="";
  getTable(replyIndex, "replytable").then(function(bal){
          
           var time=convert(bal.rows[0].timestamp);
           var accName=bal.rows[0].accName;
           var rply=bal.rows[0].reply;
           var result=accName +" : "+rply+"   "+time;
            
           
           var rplyDiv=document.createElement("div");
           document.getElementById("rplContent").appendChild(rplyDiv);
           rplyDiv.innerHTML=result;
          
           modal.style.display = "block";
          
      });
}
