pragma solidity >=0.4.21 <0.6.0;
 
/**
 * owned是合约的管理者
 */
contract owned {
    address public owner;
 
    /**
     * 初台化构造函数
     */
    constructor() public {
        owner = msg.sender;
    }
 
    /**
     * 判断当前合约调用者是否是合约的所有者
     */
    modifier onlyOwner {
        require( msg.sender == owner,
        "sender is not authorized");
        _;
    }
 
    /**
     * 合约的所有者指派一个新的管理员
     * @param  newOwner address 新的管理员帐户地址
     */
    function transferOwnership(address newOwner) public onlyOwner{
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

contract Copyright is owned{

    //属性
    struct Copyrightinfo {
        string name;//登记姓名
        string title;    //著作标题
        string id;  //身份证号
        string info;  //说明
        uint8  status;  //1是待审核，2是审核通过
    }

    //记录所有数据映射
    mapping (uint => Copyrightinfo) crinfo;

    constructor() public{}


    //保存
    function saveinfo(string memory name ,string memory title,string memory id,string memory info) public{        
        crinfo[0].name = name;
        crinfo[0].title=title;
        crinfo[0].id=id;
        crinfo[0].info=info;
        crinfo[0].status=1;
    }

    //清空数据
    function deleteinfo() public{
        crinfo[0].name = "";
        crinfo[0].title="";
        crinfo[0].id="";
        crinfo[0].info="";
        crinfo[0].status=1;
    }
 
    //查询数据
    function selectAll() public view returns (string memory name ,string memory title,string memory id,string memory info,uint8 status){
        name=crinfo[0].name;
        title=crinfo[0].title;
        id=crinfo[0].id;
        info=crinfo[0].info;  
        status=crinfo[0].status;
        return (name,title,id,info,status);
    }

    //审核
    function update() public{
        crinfo[0].status=2;
    }

}

