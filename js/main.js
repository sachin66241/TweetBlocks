var account, network, accounts, eos, options, scatterConnected;
var userslist=[];
var signedacc=[];

async function connect() {
    try{

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
   

} catch(err){
    if(err.type ="identity_rejected"){

    window.location.replace("http://127.0.0.1:5500/index.html");
    }

} 

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
        },1000);
       
    });
}

function convert(scribbletime){

    scribblesec = scribbletime/1000;
    scribblesec = parseInt(scribblesec);
    var myDate = new Date( scribblesec *1000);
    var gmt = (myDate.toLocaleString());
    var gmt1=gmt.split(",");
    var scrdate=gmt1[0];
    var now0=converttime(Date.now());
    var now=now0.split(",");
    if(gmt1[0]==now[0]){
        scrdate="today ";
    }
    var gmt2=now[0].split("/");
    var ygmt=(gmt2[0]-1)+"/"+gmt2[1]+"/"+gmt2[2];
    if(ygmt==gmt1[0]){
        scrdate="yesterday ";
    }
    var tgmt=gmt1[1].split(":");
    if(tgmt[0]>12){
        tgmt[0]=tgmt[0]-12;
        var scrtime=tgmt[0]+":"+tgmt[1]+" PM"
    }
    else var scrtime=tgmt[0]+":"+tgmt[1]+" AM" 

    return scrdate+ " "+scrtime;
    
   }

   function converttime(scribbletime){
    
    scribblesec = scribbletime/1000;
    scribblesec = parseInt(scribblesec);
    var myDate = new Date( scribblesec *1000);
    var gmt = (myDate.toLocaleString());

    

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

function a(twId){
    getTable(twId, "tweettable").then(function(res){
    var retweeters=res.rows[0].retweet;    
    var afollotweet=retweeters.concat(mainFollowing);
                $("#rplContent").empty();
                console.log(afollotweet);
                var acommonusers=find_duplicate_in_string(afollotweet);
                for(var i=2;i<acommonusers.length;i++){
                    var tweeter=userslist.find(function(x){ return x.accName === acommonusers[i] });
                    var rplyDiv=document.createElement("div");
                    document.getElementById("rplContent").appendChild(rplyDiv);
                    rplyDiv.innerHTML=tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold();
                    modal.style.display = "block";

                }
    });
}

function tweets(unique){ 
    var curr=window.location.href; 
    if(curr=="http://127.0.0.1:5500/home.html") mainFollowing.splice(0, 1);
    var allTweetDiv = document.getElementById("allTweetDiv");
    var tweetIndex = unique.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    });
    for (var index = tweetIndex.length-1; index >=0 ; index--) {
        getTable(tweetIndex[index], "tweettable").then(function(bal){
            $("#loader").hide();
            var indivTweetDiv = document.createElement('div');
            var retweetdiv = document.createElement('div');
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
            if(curr=="http://127.0.0.1:5500/home.html"){
                var follotweet=retweeters.concat(mainFollowing);
                console.log(bal.rows[0].msg);
                var commonusers=find_duplicate_in_string(follotweet);
               
                console.log(commonusers);
        }
            var tweeter=userslist.find(function(x){ return x.accName === account.name });
            
            var acc = userslist.find(function(x){ return x.accName === bal.rows[0].accName });
            var flag=0;
            if(curr=="http://127.0.0.1:5500/home.html"){

                iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold();
                if(retweeters.length>0){

                    
                    if(commonusers.length==0){
                        if(retweeters.includes(account.name)){
                            retweetdiv.innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold()+" retweeted ";
                        }
                    }
                    else{
                        if(retweeters.includes(account.name)){
                            var tweeter=userslist.find(function(x){ return x.accName === commonusers[0] });
                            if(commonusers.length<2){
                            retweetdiv.innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() +" and "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" retweeted " ;
                            }
                            else{
                                var tweeter1=userslist.find(function(x){ return x.accName === commonusers[1] });
                                if(commonusers.length==2){
                                retweetdiv.innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() +" , "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" and "+ tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" retweeted " ; 
                                }
                                else{
                                retweetdiv.innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() +" , "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" , "+ tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" and "+(commonusers.length-2) +" others".link("javascript:a("+bal.rows[0].tweetId+")")+" retweeted " ; 
                                }
                            }
                        }
                        else
                        {
                            var tweeter=userslist.find(function(x){ return x.accName === commonusers[0] });
                            if(commonusers.length==1){
                            
                            retweetdiv.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" retweeted " ;
                            }
                            else if(commonusers.length==2){
                                var tweeter1 = userslist.find(function(x){ return x.accName === commonusers[1] });
                                retweetdiv.innerHTML =  tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" and "+ tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter1.accName).bold()+ " retweeted " ;
                                }
                            else{
                                
                                var tweeter1 = userslist.find(function(x){ return x.accName === commonusers[1] });
                                retweetdiv.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" , "+tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter1.accName).bold() +" and "+ (commonusers.length-2) +" others".link("javascript:a("+bal.rows[0].tweetId+")")+" retweeted " ; 
                               

                            }
                            }
                        }
                    }
               
            }
      
            else {

                var parameters = location.href.split("#")[1];
                var tweeter=userslist.find(function(x){ return x.accName === parameters});

                if(parameters!=acc.accName){
                    if(acc.accName==account.name){
                        iname.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold()+" retweeted "+ "Your".link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() + "Tweet";
                        }
                    else{
                        iname.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold()+" retweeted "+acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() + "Tweet";

                        }
                    }
                
                else{
                    iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold(); 
                    }
           
            }

            
            idiv1.innerHTML = bal.rows[0].msg.link('http://127.0.0.1:5500/scribblebook.html#' + bal.rows[0].tweetId);
            idiv2.innerHTML= convert(bal.rows[0].timestamp);
            indivTweetDiv.appendChild(retweetdiv);
            indivTweetDiv.appendChild(iname);
            indivTweetDiv.appendChild(idiv1);
            indivTweetDiv.appendChild(idiv2);
            indivTweetDiv.appendChild(idiv3);
            indivTweetDiv.appendChild(input);
            indivTweetDiv.appendChild(button);
            if(account.name==bal.rows[0].accName)   indivTweetDiv.appendChild(delButton);
            if((account.name!=bal.rows[0].accName)&&(!(retweeters.includes(account.name))))   indivTweetDiv.appendChild(retweetButton);
            indivTweetDiv.appendChild(button);
            indivTweetDiv.appendChild(replyButton);
            indivTweetDiv.appendChild(likeButton);
            indivTweetDiv.style.paddingBottom = "40px";
            allTweetDiv.appendChild(indivTweetDiv);
            //document.getElementsByTagName('body')[0].appendChild(iDiv);
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

function find_duplicate_in_string(arra1) {
    var object = {};
    var result = [];

    arra1.forEach(function (item) {
      if(!object[item])
          object[item] = 0;
        object[item] += 1;
    })

    for (var prop in object) {
       if(object[prop] >= 2) {
           result.push(prop);
       }
    }

    return result;

}

var current = window.location.href;
setInterval(function() {
    if (window.location.href!== current) {
    window.location.reload();
    }
    }, 2000);