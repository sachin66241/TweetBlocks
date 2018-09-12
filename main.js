var account, network, accounts, eos, options;
var userslist=[];

async function connect() {
    let connected = await scatter.connect("TestPage");
    await console.log('connected', connected);
    network = {
        protocol:'http', 
        blockchain:'eos',
        host:'52.199.125.75',
        port:8888,
        chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
    };
    const requiredFields = {
        accounts:[network]
    };
    let id = await scatter.getIdentity({accounts:[network]})
    account = id.accounts.find(function(x){ return x.blockchain === 'eos' });
    options = {
        authorization: [ `${account.name}@${account.authority}`]
    };
    eos = scatter.eos(network, Eos, options);
}

async function getTable(scope,table){
    let result = await eos.getTableRows(true, "twitternew12", scope, table);
    return result;
  }

function signIn(){
    connect();
    scatter.getIdentity({accounts:[network]}).then(function(id){
        location.replace("http://127.0.0.1:5500/home.html");
    }).catch(function(x){
    });
}

function signOut(){
    scatter.forgetIdentity().then(() => {
        alert("Signed out!");
        location.replace("http://127.0.0.1:5500/index.html");
    });
}




function convert(scribbletime){

    scribblesec = scribbletime/1000;
    scribblesec = parseInt(scribblesec);

    var myDate = new Date( scribblesec *1000);
   /// console.log(myDate);
    var gmt = (myDate.toLocaleString());

    //var scribblediv = document.createElement("div");
   // scribblediv.innerHTML = "<br>" + (msg.link("scribblepage.html#" + tweetid)) +"<br>" + gmt;
    //document.getElementById('datetime').innerHTML = convdataTime;

    return gmt;
    
   }

function comment(tweetid){
        var id = "#comment"+tweetid;
        //var tweetId = parseInt(tweetid);
        var reply = $(""+id+"").val();
        console.log("reply:  "+ reply);

        const account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
        const options = {
                 authorization: [ `${account.name}@${account.authority}`]
                  };

    

        var eos = scatter.eos(network, Eos, options);

        scatter.getIdentity({accounts:[network]}).then(function(id){
            const account = id.accounts.find(function(x){ return x.blockchain === 'eos' });
            console.log('acc', account);

            eos.contract('twitternew12').then(contract => {
             var replyId = Math.floor((Math.random() * 100000) + 1);
            
             var accName = id.accounts[0].name;
            // var msg = document.forms["F1"]["msg"].value;

             var timestamp =  Date.now();
             var tweetId = Number(tweetid);
             console.log(typeof reply);

            // contract.tweet({tweetId,accName,msg:"reply",timestamp},options).then(function(res){
             contract.reply({accName,parentId:tweetId,replyId,reply,timestamp},options).then(function(res){
                    console.log('res', res);
                }).catch(function(err){
                    console.log('err', err);
                });
            });

        })
       
}

  
  function tweets(tweetIndex){  
   // tweetIndex.sort(bal.rows[0].timestamp);
    iDiv = document.createElement('div');
    iDiv.innerHTML="..........................TWEETS ..................................";
          
      for (var index = tweetIndex.length-1; index >=0 ; index--) {
     
        getTable(tweetIndex[index], "tweettable").then(function(bal){
            
       
                var iname = document.createElement('div');
                var idiv1 = document.createElement('div');
                var idiv2 = document.createElement('div');
                var idiv3 = document.createElement('div');
                var delButton = document.createElement('button');
                var input = document.createElement('textarea');
                var button = document.createElement('button');
                var replyButton = document.createElement('button');
                var likeButton = document.createElement('button');
        
                replyButton.innerHTML = "replies";
                delButton.innerHTML = "delete";
                button.innerHTML = "Comment";
                replyButton.id = "button"+bal.rows[0].tweetId;
                input.id='comment'+bal.rows[0].tweetId;
                input.name = "post";
                input.maxLength = "100";
                input.cols = "20";
                input.rows = "3";
  
                val=0;
                var likedUsers=[];                    
                while(val<bal.rows[0].likes.length){
          
                likedUsers.push(bal.rows[0].likes[val]);
                val++
                }
                
                
                if(likedUsers.includes(account.name)){
  
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
               delButton.setAttribute('onclick','deleteTweet('+bal.rows[0].tweetId+')');
              
               var acc = userslist.find(function(x){ return x.accName === bal.rows[0].accName });

                iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold();
              

                
                idiv1.innerHTML = bal.rows[0].msg;
                idiv2.innerHTML= convert(bal.rows[0].timestamp);
              
                iDiv.appendChild(iname);
                iDiv.appendChild(idiv1);
                iDiv.appendChild(idiv2);
                iDiv.appendChild(idiv3);
                iDiv.appendChild(input);

                if(account.name==bal.rows[0].accName)
                {    
                iDiv.appendChild(delButton);
                }

                iDiv.appendChild(button);
                iDiv.appendChild(replyButton);
                iDiv.appendChild(likeButton);
          
                document.getElementsByTagName('body')[0].appendChild(iDiv);
  
              });
  
            }
          }
                
  
  
  function replie(twId){
    
  
    getTable(twId, "tweettable").then(function(bal){
  
       for (let index = bal.rows[0].replies.length-1; index >=0; index--) {
            reply(bal.rows[0].replies[index]);
          //  console.log(bal);
                  
        }
      });
    }
  
  
  
  function reply(replyIndex){
  
    document.getElementById("rplContent").innerHTML="";
    getTable(replyIndex, "replytable").then(function(bal){
            
             var time=convert(bal.rows[0].timestamp);
             var accName=bal.rows[0].accName;
             var rply=bal.rows[0].reply;
             var acc = userslist.find(function(x){ return x.accName === accName });
             var result=acc.userName.link('http://127.0.0.1:5500/profile.html#' + acc.accName) +" : "+rply+"   "+time;
             
            
             var rplyDiv=document.createElement("div");
             document.getElementById("rplContent").appendChild(rplyDiv);
             rplyDiv.innerHTML=result;
            
             modal.style.display = "block";
            
             
            
        });
  }


  function like(twId){


    eos.contract('twitternew12').then(contract => {

        contract.like({accName:account.name,tweetId:twId},options).then(function(res){
            console.log('res', res);
           // likeButton.innerHTML="unlike";
            //main();
        }).catch(function(err){
            console.log('err', err);
        });
    });

}

function unlike(twId){

    eos.contract('twitternew12').then(contract => {

        contract.unlike({accName:account.name,tweetId:twId},options).then(function(res){
            console.log('res', res);
           // likeButton.innerHTML="like";
           // main();
        }).catch(function(err){
            console.log('err', err);
        });
    });

}

function deleteTweet(twId){

    eos.contract('twitternew12').then(contract => {

        contract.deletetweet({accName:account.name,tweetId:twId},options).then(function(res){
            console.log('res', res);
           
            main();
        }).catch(function(err){
            console.log('err', err);
        });
    });

}



          