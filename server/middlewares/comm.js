const crypto = require('crypto');
const pool = require('../lib/mysql');
let config = require('../config/config').getInstance().config;
const logger = config.logger;

//md5加密
let md5 = function (text) {
    return crypto.createHash('md5').update(text).digest('hex');
};

// 格式2位数字
let format = function (param) {
    return (parseInt(param) < 10) ? '0' + param : param;
};

// 秒转时间
let second2Time = function (second) {
    let s = parseInt(second);
    let t = '00:00:00';
    if (s > 0) {
        let hour = parseInt(s / 3600);
        let min = parseInt(s / 60) % 60;
        let sec = s % 60;
        t = '' + format(hour) + ':' + format(min) + ':' + format(sec);
    }
    return t;
};

//执行sql语句 param:{sql:'',option:''}
let execSql = function (db, param, cb) {
    let mysqlService = config.db[db];
    if (!mysqlService) {
        return cb(new Error('config.js没有配置数据库名与服务器对应关系'));
    }
    let poolSer = pool[mysqlService];
    if (!poolSer) {
        return cb(new Error('mysql.js没有导出连接池'));
    }
    poolSer.getConnection(function (err, connection) {
        if (err) {
            return cb(err);
        }
        if (param.option) {
            connection.query(param.sql, param.option, function (err, row) {
                connection.release();
                cb(err, row);
            });
        } else {
            connection.query(param.sql, function (err, row) {
                connection.release();
                cb(err, row);
            });
        }
    });
};

//获取poolSer 连接池
let getPoolSer = function (db, cb) {
    let mysqlService = config.db[db];
    if (!mysqlService) {
        return cb(new Error('config.js没有配置数据库名与服务器对应关系'));
    }
    let poolSer = pool[mysqlService];
    if (!poolSer) {
        return cb(new Error('mysql.js没有导出连接池'));
    } else {
        return cb(null, poolSer);
    }
};

// 菜单格式化
/*let arr = [
    {id: 1, name: 'a1', parentId: 0},
    {id: 2, name: 'a1-2', parentId: 1},
    {id: 3, name: 'a1-3', parentId: 1},
    {id: 4, name: 'a1-2-4', parentId: 2},
    {id: 5, name: 'a1-2-5', parentId: 2},
    {id: 6, name: 'a6', parentId: 0},
    {id: 7, name: 'a6-7', parentId: 6},
    {id: 8, name: 'a6-8', parentId: 6},
    {id: 14, name: 'a1-2-4-14', parentId: 4},
    {id: 15, name: 'a1-2-4-15', parentId: 4}
];
输出



*/

let formatMenu = function(arr){
    let data = [];
    let tree = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].parentId !== 0) {
            for (let j = 0; j < arr.length; j++) {
                if (arr[i].parentId === arr[j].id) {
                    let isExist = false;
                    for (let k = 0; k < tree.length; k++) {
                        if (tree[k].id === arr[j].id) {
                            isExist = true;
                            let isChildrenExist = false;
                            for (let m = tree[k].children.length - 1; m >= 0; m--) {  // 防止children子元素重复多个
                                if (tree[k].children[m].id === arr[i].id) {
                                    isChildrenExist = true;
                                    break;
                                }
                            }
                            if (!isChildrenExist) {
                                tree[k].children.push(arr[i]);
                            }
                            break;
                        }
                    }
                    if (!isExist) {
                        arr[j].children = [];
                        arr[j].children.push(arr[i]);
                        tree.push(arr[j]);
                    }
                    break;
                }
            }
        }
    }

    for(let i=0; i<tree.length; i++){
        if(tree[i].parentId === 0){
            data.push(tree[i])
        }
    }
    return data;
};

// 整合每个角色下的所有权限
let roleAllAccess = function(data){
    let arr = [];
    for (let i = 0; i < data.length; i++) {
        let access = {
            id: data[i].id,
            parentId: data[i].parentId,
            menuName: data[i].menuName,
            sort: data[i].sort,
            isLeaf: data[i].isLeaf
        };
        let isExist = false;
        let isExistIndex = '';
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].roleId === data[i].roleId) {
                isExist = true;
                isExistIndex = j;
                break;
            }
        }
        if (isExist) {
            arr[isExistIndex].accessArr.push(access)
        } else {
            arr.push({
                roleName: data[i].roleName,
                roleId: data[i].roleId,
                uptime: data[i].uptime,
                accessArr: [access]
            });
        }
    }
    return arr;
};

// 选出每个角色下实际存在的权限进行树形结构
let realAccessToTree= function(arr){
    for (let i = 0; i < arr.length; i++) {
        let hasAccessArr = [];
        let accessArr = arr[i].accessArr;
        for(let j=0; j<accessArr.length; j++){
            if (accessArr[j].id) {
                hasAccessArr.push(accessArr[j])
            }
        }
        console.log('hasAccessArr', hasAccessArr);
        let tree = formatMenu(hasAccessArr);
        arr[i].tree = tree;
        delete arr[i].accessArr;
    }
    return arr;
};

//导出
module.exports = {
    md5: md5,
    formatMenu: formatMenu,
    roleAllAccess: roleAllAccess,
    realAccessToTree: realAccessToTree,
    execSql: execSql,
    getPoolSer: getPoolSer,
};