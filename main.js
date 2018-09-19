var account, network, accounts, eos, options, scatterConnected;
var userslist=[];
var signedacc=[];

async function connect() {
    scatterConnected = await scatter.connect("TestPage");
    await console.log('connected', scatterConnected);
    
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
    let result = await eos.getTableRows(true, "slateme22333", scope, table);
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
        modal.style.display = "block";
        $("#rplContent").html("Signed Out");
        setTimeout(function(){
            location.replace("http://127.0.0.1:5500/index.html");
        },2000);
       
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

function convertDate(myDate){
    
   return(new Date(myDate).getTime()); 

} 

function comment(tweetid){
    var id = "#comment"+tweetid;
    var reply = $(""+id+"").val();
    if(reply=="")   return;
    const account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
    const options = {
        authorization: [ `${account.name}@${account.authority}`]
    };
    var eos = scatter.eos(network, Eos, options);
    scatter.getIdentity({accounts:[network]}).then(function(id){
        const account = id.accounts.find(function(x){ return x.blockchain === 'eos' });
        eos.contract('slateme22333').then(contract => {
            var replyId = Math.floor((Math.random() * 100000) + 1);
            var accName = id.accounts[0].name;
            var timestamp =  Date.now();
            var tweetId = Number(tweetid);
            contract.reply({accName,parentId:tweetId,replyId,reply,timestamp},options).then(function(res){
                console.log('res', res);
                main();
            }).catch(function(err){
                console.log('err', err);
            });
        });
    })
}
  
function tweets(tweetIndex){  
    iDiv = document.createElement('div');
    iDiv.id="divisionId"
    var repeats=find_duplicate_in_array(tweetIndex);
    console.log(repeats);
    for(var k=repeats.length-1;k>=0;k--){
    for(var c=0;c<tweetIndex.length;c++){
       if(repeats[k]==tweetIndex[c]){
            tweetIndex.splice(c, 1);
            
       }
    }
}
    
   
    iDiv.innerHTML="..........................TWEETS ..................................";
    for (var index = tweetIndex.length-1; index >=0 ; index--) {
        getTable(tweetIndex[index], "tweettable").then(function(bal){  
            var iname = document.createElement('div');
            var idiv1 = document.createElement('div');
            var idiv2 = document.createElement('div');
            var idiv3 = document.createElement('div');
            var delButton = document.createElement('button');
            var retweetButton = document.createElement('button');
            var input = document.createElement('textarea');
            var button = document.createElement('button');
            var replyButton = document.createElement('button');
            var likeButton = document.createElement('button');
            replyButton.innerHTML = "replies ("+bal.rows[0].replies.length+")";
            delButton.innerHTML = "delete";
            retweetButton.innerHTML = "reTweet";
            button.innerHTML = "Comment";
            replyButton.id = "button"+bal.rows[0].tweetId;
            input.id='comment'+bal.rows[0].tweetId;
            input.name = "post";
            input.maxLength = "100";
            input.cols = "20";
            input.rows = "3";
            var likedUsers=[];                    
            for(var val = 0;val<bal.rows[0].likes.length;val++){
                likedUsers.push(bal.rows[0].likes[val]);
            }
            if(likedUsers.includes(account.name)){
                likeButton.innerHTML="unlike ("+likedUsers.length+")";
                likeButton.setAttribute('onclick','unlike('+bal.rows[0].tweetId+')');
            }
            else{
                
                likeButton.innerHTML="like ("+likedUsers.length+")";
                likeButton.setAttribute('onclick','like('+bal.rows[0].tweetId+')');
            } 
            var xxx = input.value;
            replies=bal.rows[0].replies;
            if(replies.length>0){
                replyButton.setAttribute('onclick','replie('+bal.rows[0].tweetId+')');
            }
            button.setAttribute('onclick', 'comment('+bal.rows[0].tweetId+')');
            delButton.setAttribute('onclick','deleteTweet('+bal.rows[0].tweetId+')');
            retweetButton.setAttribute('onclick','reTweet('+bal.rows[0].tweetId+')');
            var retweeters=bal.rows[0].retweet;
            var tweeter=userslist.find(function(x){ return x.accName === account.name });
            console.log(bal.rows[0]);
            var acc = userslist.find(function(x){ return x.accName === bal.rows[0].accName });
            var flag=0;
            var curr=window.location.href;
            if(curr=="http://127.0.0.1:5500/home.html"){
            
            delete mainFollowing[0];
            if(acc.accName==account.name){
                iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold(); 
            }
            else   {
                if(retweeters.length>0){
                    if(retweeters.includes(account.name)){
                        iname.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold()+" retweeted "+acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() + "Tweet";
                    }
                    else
                    {
                        for(var j=0;j<mainFollowing.length;j++){
                            if((retweeters.includes(mainFollowing[j]))&&(acc.accName!=account.name)){
                                var tweeter=userslist.find(function(x){ return x.accName === mainFollowing[j] });
                                iname.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold()+" retweeted "+acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() + "Tweet";
                            }
                            
                            else if(mainFollowing[j]!=undefined){
                                console.log(mainFollowing);
                                iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold(); 
                            }

                        }
                    }
                }
                else{
                    iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold();
                }
            }
               
            }
      
            else {

                var parameters = location.href.split("#")[1];
                var tweeter=userslist.find(function(x){ return x.accName === parameters});

                if(parameters!=acc.accName){
                 iname.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold()+" retweeted "+acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() + "Tweet";
                }
                else{
                    iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold(); 
                }
           
         }
            
            idiv1.innerHTML = bal.rows[0].msg.link('http://127.0.0.1:5500/scribblebook.html#' + bal.rows[0].tweetId);
            idiv2.innerHTML= convert(bal.rows[0].timestamp);
            iDiv.appendChild(iname);
            iDiv.appendChild(idiv1);
            iDiv.appendChild(idiv2);
            iDiv.appendChild(idiv3);
            iDiv.appendChild(input);
            iDiv.appendChild(button);
            if(account.name==bal.rows[0].accName)   iDiv.appendChild(delButton);
            if((account.name!=bal.rows[0].accName)&&(!(retweeters.includes(account.name))))   iDiv.appendChild(retweetButton);
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
    eos.contract('slateme22333').then(contract => {
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
    eos.contract('slateme22333').then(contract => {
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
    eos.contract('slateme22333').then(contract => {
        contract.deletetweet({accName:account.name,tweetId:twId},options).then(function(res){
            console.log('res', res);
            main();
        }).catch(function(err){
            console.log('err', err);
        });
    });
}

function reTweet(twId){
    eos.contract('slateme22333').then(contract => {
        contract.retweet({accName:account.name,tweetId:twId},options).then(function(res){
            console.log('res', res);
            main();
        }).catch(function(err){
            console.log('err', err);
        });
    });
}

function find_duplicate_in_array(arra1) {
    var object = {};
    var result = [];

    arra1.forEach(function (item) {
      if(!object[item])
          object[item] = 0;
        object[item] += 1;
    })

    for (var prop in object) {
       if(object[prop] >= 2) {
           result.push(parseInt(prop));
       }
    }

    return result;

}