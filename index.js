var network;
function con(){
    scatter.connect("TestPage").then(function(connected){
        console.log('connected', connected);

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
        alert("Signed out!")
    });
}
