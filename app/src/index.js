import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/Copyright.json";
// import globals from './globals';



const App = {
  web3: null,
  account: null, 
  meta: null,
  

  start: async function() {
    const { web3 } = this;
    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
      console.log(error);
    }
  },

  selectAll: async function(){
    const { selectAll } = this.meta.methods;
    var result = await selectAll().call();
    var flightInfo = result.flightInfo;
    var number = result.number;
    document.getElementById("aviation-flight").innerHTML = flightInfo;
    document.getElementById("aviation-number").innerHTML = number;
  },

  save: async function(name,title,explan,num){
    const { web3 } = this;
    const { saveinfo } = this.meta.methods;
    await saveinfo(name,title,num,explan).send({from:this.account, gas: 3141592},function(error, transactionHash){
      localStorage.setItem("copyright_hash_1", transactionHash);
      var url = "success.html?type=1";
      window.location.href=url; 
    });
  },

  address:async function(){
    await this.start();
    const { web3 } = this;
    document.getElementById("address_1").innerHTML = this.account;
    document.getElementById("address_2").innerHTML = this.account;
    document.getElementById("address_3").innerHTML = this.account;
  },

  update: async function() {
    const { web3 } = this;
    const { update } = this.meta.methods;
    await  update().send({from:this.account, gas: 3141592},function(error, transactionHash){
      var url = "success.html?type=2";
      window.location.href=url;
      localStorage.setItem("copyright_hash_2", transactionHash);
    });
    
  },
  search: async function(type) {
    const { selectAll } = this.meta.methods;
    var result = await selectAll().call();
    if(type == 1){
      if(result.name == ""){
        var url = "register.html";
        window.location.href=url; 
      }else{
        alert("用户信息已完善！");
        return;
      }
    }else if(type == 2){
      if(result.status == 2){
        alert("出版社已确认！");
        return;
      }
      var url = "press.html";
      window.location.href=url; 
    } 
  },
  press: async function() {
    await this.start();
    const { web3 } = this;
    const { selectAll } = this.meta.methods;
    var result = await selectAll().call();
    document.getElementById("press_name").innerHTML = result.name;
    document.getElementById("press_title").innerHTML = result.title;
    document.getElementById("press_id").innerHTML = result.id;;
    document.getElementById("press_info").innerHTML = result.info;
    document.getElementById("tx_hash").innerHTML = localStorage.getItem("copyright_hash_1");
    if(localStorage.getItem("copyright_hash_1") != null){
      web3.eth.getTransaction(localStorage.getItem("copyright_hash_1"),function(error, transaction){
        document.getElementById("height").innerHTML = transaction.blockNumber;
        document.getElementById("block_hash").innerHTML = transaction.blockHash;
      });
    }
  },
  hash: async function(type) {
    if(type == 1){
      document.getElementById("hash").innerHTML = localStorage.getItem("copyright_hash_1");
    }else if(type == 2){
      document.getElementById("hash").innerHTML = localStorage.getItem("copyright_hash_2");
    }
  },
  select_register:async function(single) {
    if(localStorage.getItem("copyright_hash_1") != single){
      alert("暂无信息");
    }else{
      var url = "select-register.html";
      window.location.href=url;
    }
  },
  select_register_info: async function() {
    await this.start();
    const { web3 } = this;
    const { selectAll } = this.meta.methods;
    var result = await selectAll().call();
    document.getElementById("register_head").innerHTML = result.name;
    document.getElementById("register_title").innerHTML = result.title;
    document.getElementById("register_id").innerHTML = result.id;
    document.getElementById("register_info").innerHTML = result.title;
    web3.eth.getTransaction(localStorage.getItem("copyright_hash_1"),function(error, transaction){
      document.getElementById("height").innerHTML = transaction.blockNumber;
      document.getElementById("block_hash").innerHTML = transaction.blockHash;
      document.getElementById("tx_hash").innerHTML = localStorage.getItem("copyright_hash_1");
    });
  },
  select_press_info: async function() {
    if(localStorage.getItem("copyright_hash_2") == null){
    }else{
      const { web3 } = this;
      web3.eth.getTransaction(localStorage.getItem("copyright_hash_2"),function(error, transaction){
        document.getElementById("height").innerHTML = transaction.blockNumber;
        document.getElementById("block_hash").innerHTML = transaction.blockHash;
        document.getElementById("tx_hash").innerHTML = localStorage.getItem("copyright_hash_1");
      });
    }
  },
  remake: async function() {
    const { deleteinfo } = this.meta.methods;
    await  deleteinfo().send({from:this.account, gas: 3141592},function(error, transactionHash){
      localStorage.setItem("copyright_hash_1", null);
      localStorage.setItem("copyright_hash_2", null);
      alert("成功");
    });
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://192.168.1.167:7545"),
    );
  }
  App.start();
});
