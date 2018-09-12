
var network = {
    protocol:'http', 
    blockchain:'eos',
    host:'52.199.125.75',
    port:8888,
    chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
};
const requiredFields = {
    accounts:[network]
};
    



function signIn(){
    scatter.connect("TestPage").then(function(connected){
        console.log('connected', connected);
        network = {
            protocol:'http', 
            blockchain:'eos',
            host:'52.199.125.75',
            port:8888,
            chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
        };
        //alert("1");
        const requiredFields = {
            accounts:[network]
        };
        //alert("2");
                scatter.getIdentity({accounts:[network]}).then(function(id){
                    const account = id.accounts.find(function(x){ return x.blockchain === 'eos' });
                    console.log('acc', account);
    
                    //eos.transfer(account.name, 'eosio', '1.0000 TLOS', '').then(function(res){
                    //     console.log('res', res);
                    // }).catch(function(err){
                    //     console.log('err', err);
                    // })  
                               
                })
               
    }).catch(function(x){
        console.log('x', x);
    });
   
   
}

function signOut(){
    scatter.forgetIdentity().then(() => {
        
        alert("Signed out!");
        location.replace("http://127.0.0.1:5500/index1.html");

    });
}  


function signUp(){

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
            scatter.getIdentity({accounts:[network]}).then(function(id){
                const account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
                const options = {
                 authorization: [ `${account.name}@${account.authority}`]
                  };

        console.log(account);
        console.log(options);          
    

        var eos = scatter.eos(network, Eos, options);

                eos.contract('twitternew12').then(contract => {
                 
                
                 var accName = id.accounts[0].name;
                 var userName = document.forms["F2"]["userName"].value;

                console.log(accName);
                 

                 contract.signup({accName,userName},options).then(function(res){
                        console.log('res', res);
                    }).catch(function(err){
                        console.log('err', err);
                    });
                });

            })
    
}
              
 function test(){
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

         const account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
        const options = {
                 authorization: [ `${account.name}@${account.authority}`]
                  };

    

        var eos = scatter.eos(network, Eos, options);

        
            scatter.getIdentity({accounts:[network]}).then(function(id){
                const account = id.accounts.find(function(x){ return x.blockchain === 'eos' });
                console.log('acc', account);

                eos.contract('twitternew12').then(contract => {
                 var tweetId = Math.floor((Math.random() * 100000) + 1);
                
                 var accName = id.accounts[0].name;
                 var msg = document.forms["F1"]["msg"].value;

                 var timestamp =  Date.now();
                    console.log("aaa:"+typeof msg);
                 contract.tweet({tweetId,accName,msg,timestamp},options).then(function(res){
                        console.log('res', res);
                    }).catch(function(err){
                        console.log('err', err);
                    });
                });

            })
        
           
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
      //  console.log("reply:  "+ reply);

        const account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
        const options = {
                 authorization: [ `${account.name}@${account.authority}`]
                  };

    

        var eos = scatter.eos(network, Eos, options);

        scatter.getIdentity({accounts:[network]}).then(function(id){
            const account = id.accounts.find(function(x){ return x.blockchain === 'eos' });
       //     console.log('acc', account);

            eos.contract('twitternew12').then(contract => {
             var replyId = Math.floor((Math.random() * 100000) + 1);
            
             var accName = id.accounts[0].name;
            // var msg = document.forms["F1"]["msg"].value;

             var timestamp =  Date.now();
             var tweetId = Number(tweetid);
          //   console.log(typeof reply);

            // contract.tweet({tweetId,accName,msg:"reply",timestamp},options).then(function(res){
             contract.reply({accName,parentId:tweetId,replyId,reply,timestamp},options).then(function(res){
                    console.log('res', res);
                    main();
                }).catch(function(err){
                    console.log('err', err);
                });
            });

        })
       
}



           
       
       

   
       



