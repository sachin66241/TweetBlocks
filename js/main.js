var account, network, accounts, eos, options, scatterConnected, requiredFields;
var userslist=[];
var signedacc=[];

async function connect() {
    try{

    scatterConnected = await scatter.connect("TestPage");
    await console.log('connected', scatterConnected);
    
    network = {
        protocol:'https', 
        blockchain:'eos',
        host:'api.jungle.alohaeos.com',
        port:443,
        chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
    };
    requiredFields = {
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
    let result = await eos.getTableRows(true, "slatemelate1", scope, table);
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
    if(tgmt[0]==12) var scrtime=tgmt[0]+":"+tgmt[1]+" PM"
    else if((tgmt[0]<12)&&(tgmt[0]>0)) var scrtime=tgmt[0]+":"+tgmt[1]+" AM";
    else if(tgmt[0]>12){
    tgmt[0]=tgmt[0]-12;
        var scrtime=tgmt[0]+":"+tgmt[1]+" PM";
    }
    else var scrtime=12+":"+tgmt[1]+" AM";


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
    
    if(signedUp){
    var id = "#comment"+tweetid;
    var reply = $(""+id+"").val();
    if(reply=="")   return;
        eos.contract('slatemelate1').then(contract => {
            var replyId = Math.floor((Math.random() * 100000) + 1);
            var accName = account.name;
            var timestamp =  Date.now();
            var tweetId = Number(tweetid);
            contract.reply({accName,parentId:tweetId,replyId,reply:reply,timestamp},options).then(function(res){
                console.log(account.name,replyId);
                console.log('res', res);
                $(""+id+"").val("");
                getTable(tweetId,"tweettable").then(function(res){
                    console.log(res.rows[0].replies.length);
                    $("#replyBtn"+tweetId).html("replies ("+res.rows[0].replies.length+")");
                    if(res.rows[0].replies.length>0){
                        document.getElementById("replyBtn"+res.rows[0].tweetId).setAttribute('onclick','replie('+res.rows[0].tweetId+')');
                    }
                    
                })
            }).catch(function(err){
                console.log('err', err);
            });
        });
    }
        else{
            document.getElementById("rplContent").innerHTML="";
            document.getElementById("rplContent").innerHTML="Sign up first";
            modal.style.display = "block";
        }
}

function otherRetweet(twId){
    getTable(twId, "tweettable").then(function(res){
    var retweeters=res.rows[0].retweet;    
    var afollotweet=retweeters.concat(mainFollowing);
                $("#rplContent").empty();
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
            indivTweetDiv.id = "tweetdiv"+bal.rows[0].tweetId;
            var retweetdiv = document.createElement('div');
            retweetdiv.id="retweetdiv"+bal.rows[0].tweetId;
            var iname = document.createElement('div');
            var idiv1 = document.createElement('div');
            var idiv2 = document.createElement('div');
            var idiv3 = document.createElement('div');
            var delButton = document.createElement('button');
            var retweetButton = document.createElement('button');
            var input = document.createElement('textarea');
            var commentBtn = document.createElement('input');
            commentBtn.type = "button";
            commentBtn.value = "Comment";
            commentBtn.style.position = "absolute";
            commentBtn.style.left = 200;
            var replyButton = document.createElement('button');
            var likeButton = document.createElement('button');
            likeButton.id = "likeBtn"+ bal.rows[0].tweetId;
            retweetButton.id="retweetBtn"+ bal.rows[0].tweetId;
            replyButton.innerHTML = "replies ("+bal.rows[0].replies.length+")";
            delButton.innerHTML = "delete";
            retweetButton.innerHTML = "reTweet ("+bal.rows[0].retweet.length+")";
            commentBtn.innerHTML = "Comment";
            replyButton.id = "replyBtn"+bal.rows[0].tweetId;
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
            commentBtn.setAttribute('onclick', 'comment('+bal.rows[0].tweetId+')');
            delButton.setAttribute('onclick','deleteTweet('+bal.rows[0].tweetId+')');
            retweetButton.setAttribute('onclick','reTweet('+bal.rows[0].tweetId+')');
            var retweeters=bal.rows[0].retweet;
            if(curr=="http://127.0.0.1:5500/home.html"){
                var follotweet=retweeters.concat(mainFollowing);
               
                var commonusers=find_duplicate_in_string(follotweet);
            }
            var user=userslist.find(function(x){ return x.accName === account.name }); 
            var acc = userslist.find(function(x){ return x.accName === bal.rows[0].accName });
            if(curr=="http://127.0.0.1:5500/home.html"){

                iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold();
                if(retweeters.length>0){

                    
                    if(commonusers.length==0){
                        if(retweeters.includes(account.name)){
            
                            retweetdiv.innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + user.accName).bold()+" retweeted ";
                        }
                    }
                    else{
                        if(retweeters.includes(account.name)){
                            var tweeter=userslist.find(function(x){ return x.accName === commonusers[0] });
                            if(commonusers.length<2){
                            retweetdiv.innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + user.accName).bold() +" and "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" retweeted " ;
                            }
                            else{
                                var tweeter1=userslist.find(function(x){ return x.accName === commonusers[1] });
                                if(commonusers.length==2){
                                retweetdiv.innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + user.accName).bold() +" , "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" and "+ tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" retweeted " ; 
                                }
                                else{
                                retweetdiv.innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + user.accName).bold() +" , "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" , "+ tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" and "+(commonusers.length-2) +" others".link("javascript:otherRetweet("+bal.rows[0].tweetId+")")+" retweeted " ; 
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
                                retweetdiv.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" , "+tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter1.accName).bold() +" and "+ (commonusers.length-2) +" others".link("javascript:otherRetweet("+bal.rows[0].tweetId+")")+" retweeted " ; 
                               

                            }
                            }
                        }
                    }
               
            }
      
            else {

                var parameters = location.href.split("#")[1];
                var tweeter=userslist.find(function(x){ return x.accName === parameters});
                

                if(parameters==account.name){
                    if(acc.accName!=account.name)
                    iname.innerHTML = "you".link( 'http://127.0.0.1:5500/profile.html#' + user.accName).bold()+" retweeted "+ acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() + "Tweet";
        
                    else iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold();
    
                }

                else if(parameters==acc.accName)
                iname.innerHTML = acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold(); 

                else{

                    if(acc.accName==account.name){
                        iname.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" retweeted "+ "Your".link( 'http://127.0.0.1:5500/profile.html#' + user.accName).bold() + "Tweet";
                        }
                    else{
                        iname.innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" retweeted "+acc.userName.link( 'http://127.0.0.1:5500/profile.html#' + acc.accName).bold() + "Tweet";

                        }
                    }
           
            }

            
            idiv1.innerHTML = bal.rows[0].msg.link('http://127.0.0.1:5500/scribblebook.html#' + bal.rows[0].tweetId);
            idiv2.innerHTML= convert(bal.rows[0].timestamp);
            indivTweetDiv.appendChild(retweetdiv);
            indivTweetDiv.appendChild(iname);
            indivTweetDiv.appendChild(commentBtn);
            indivTweetDiv.appendChild(idiv1);
            indivTweetDiv.appendChild(idiv2);
            indivTweetDiv.appendChild(idiv3);
            indivTweetDiv.appendChild(input);
            indivTweetDiv.appendChild(commentBtn);
            indivTweetDiv.appendChild(replyButton);
            if((account.name==bal.rows[0].accName)&&((curr=="http://127.0.0.1:5500/home.html")||(curr=="http://127.0.0.1:5500/profile.html#"+account.name)))   
            indivTweetDiv.appendChild(delButton);
            if((account.name!=bal.rows[0].accName)&&(!(retweeters.includes(account.name)))) indivTweetDiv.appendChild(retweetButton);
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
        console.log(replyIndex,bal.rows[0].reply);
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
    if(signedUp){
    eos.contract('slatemelate1').then(contract => {
        contract.like({accName:account.name,tweetId:twId},options).then(function(res){
            getTable(twId,"tweettable").then(function(bal){
                $("#likeBtn"+twId).html("unlike ("+bal.rows[0].likes.length+")");
                document.getElementById("likeBtn"+twId).setAttribute('onclick','unlike('+bal.rows[0].tweetId+')');
            })
            console.log('res', res);
        }).catch(function(err){
            console.log('err', err);
        });
    });
}
else{
    document.getElementById("rplContent").innerHTML="";
    document.getElementById("rplContent").innerHTML="Sign up first";
    modal.style.display = "block";
}
}

function unlike(twId){
    if(signedUp){
    eos.contract('slatemelate1').then(contract => {
        contract.unlike({accName:account.name,tweetId:twId},options).then(function(res){
            getTable(twId,"tweettable").then(function(res){
                $("#likeBtn"+twId).html("like ("+res.rows[0].likes.length+")");
                document.getElementById("likeBtn"+twId).setAttribute('onclick','like('+res.rows[0].tweetId+')');
            })
            console.log('res', res);
        }).catch(function(err){
            console.log('err', err);
        });
    });
}
else{
    document.getElementById("rplContent").innerHTML="";
    document.getElementById("rplContent").innerHTML="Sign up first";
    modal.style.display = "block";
}
}

function deleteTweet(twId){
    eos.contract('slatemelate1').then(contract => {
        contract.deletetweet({accName:account.name,tweetId:twId},options).then(function(res){
            console.log('res', res);
            var tweetDiv = document.getElementById("tweetdiv"+twId);
            document.getElementById("allTweetDiv").removeChild(tweetDiv);
        }).catch(function(err){
            console.log('err', err);
        });
    });
}

function reTweet(twId){
    if(signedUp){

    eos.contract('slatemelate1').then(contract => {
        contract.retweet({accName:account.name,tweetId:twId},options).then(function(res){
            console.log('res', res);
            document.getElementById("retweetBtn"+twId).style.display="none";
            var curr=window.location.href
            if(curr=="http://127.0.0.1:5500/home.html"){
                getTable(twId, "tweettable").then(function(bal){ 
                var acc = userslist.find(function(x){ return x.accName === bal.rows[0].accName });
                var retweeters=bal.rows[0].retweet;
                var follotweet=retweeters.concat(mainFollowing);           
                var commonusers=find_duplicate_in_string(follotweet);
                if(retweeters.length>0){

                    if(commonusers.length==0){
                        if(retweeters.includes(account.name)){
                            
                            document.getElementById("retweetdiv"+bal.rows[0].tweetId).innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + account.name).bold()+" retweeted ";
                        }
                    }
                    else{
                        if(retweeters.includes(account.name)){
                            var tweeter=userslist.find(function(x){ return x.accName === commonusers[0] });
                            if(commonusers.length<2){
                                document.getElementById("retweetdiv"+bal.rows[0].tweetId).innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + account.name).bold() +" and "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" retweeted " ;
                            }
                            else{
                                var tweeter1=userslist.find(function(x){ return x.accName === commonusers[1] });
                                if(commonusers.length==2){
                                    document.getElementById("retweetdiv"+bal.rows[0].tweetId).innerHTML= "You".link( 'http://127.0.0.1:5500/profile.html#' + account.name).bold() +" , "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" and "+ tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" retweeted " ; 
                                }
                                else{
                                    document.getElementById("retweetdiv"+bal.rows[0].tweetId).innerHTML = "You".link( 'http://127.0.0.1:5500/profile.html#' + account.name).bold() +" , "+ tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" , "+ tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold()+" and "+(commonusers.length-2) +" others".link("javascript:othersDisplay("+bal.rows[0].tweetId+")")+" retweeted " ; 
                                }
                            }
                        }
                        else
                        {
                            var tweeter=userslist.find(function(x){ return x.accName === commonusers[0] });
                            if(commonusers.length==1){
                            
                                document.getElementById("retweetdiv"+bal.rows[0].tweetId).innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" retweeted " ;
                            }
                            else if(commonusers.length==2){
                                var tweeter1 = userslist.find(function(x){ return x.accName === commonusers[1] });
                                document.getElementById("retweetdiv"+bal.rows[0].tweetId).innerHTML =  tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" and "+ tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter1.accName).bold()+ " retweeted " ;
                                }
                            else{
                                
                                var tweeter1 = userslist.find(function(x){ return x.accName === commonusers[1] });
                                document.getElementById("retweetdiv"+bal.rows[0].tweetId).innerHTML = tweeter.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter.accName).bold() +" , "+tweeter1.userName.link( 'http://127.0.0.1:5500/profile.html#' + tweeter1.accName).bold() +" and "+ (commonusers.length-2) +" others".link("javascript:othersDisplay("+bal.rows[0].tweetId+")")+" retweeted " ; 
                            

                            }
                            }
                        }
                    }
                });
            }

            

        }).catch(function(err){
            console.log('err', err);
        });
    });
}
    else{
        document.getElementById("rplContent").innerHTML="";
        document.getElementById("rplContent").innerHTML="Sign up first";
        modal.style.display = "block";
    }
    
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



