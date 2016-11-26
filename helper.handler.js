function setHelpers(roomName, builders, upgraders){
    Memory.helpers[roomName] = {
        "builders": {
            "count": builders,
            "parts": [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            "targetBase": roomName
        },
        "upgraders": {
            "count": upgraders,
            "parts": [WORK,CARRY,MOVE,MOVE],
            "targetBase": roomName
        }
    };
}

function run(){
    var helpers = Memory.helpers;
    for(var roomName in helpers){
        var helperData = helpers[roomName];
        var upgraders = _(Game.creeps).filter({ memory: { role: 'helperUpgrader'}}).value();
        var builders = _(Game.creeps).filter({ memory: { role: 'helperBuilder'}}).value();
        if(upgraders.length < helperData.upgraders.count){
            var home = Game.spawns['Spawn1'].room.name;
            Game.spawns['Spawn1'].createCreep(helperData.upgraders.parts, undefined, {role: "helperUpgrader", targetRoom: roomName, homeRoom: home});
        }
        if(builders.length < helperData.builders.count){
            Game.spawns['Spawn1'].createCreep(helperData.builders.parts, undefined, {role: "helperBuilder", targetRoom: roomName, homeRoom: home});
        }
    }
    for(var cName in Game.creeps){
        var creep = Game.creeps[cName];
        if(creep.memory.role == "helperBuilder"){
            runBuilder(creep);
        }
        if(creep.memory.role == "helperUpgrader"){
            runUpgrader(creep);
        }
    }
}

function runBuilder(creep){
}

function runUpgrader(creep){
    var targetRoom = creep.memory.targetRoom;
    var homeRoom = creep.memory.homeRoom;
    if(creep.carry.energy == 0){
        if(creep.room.name != homeRoom){
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(homeRoom)));
        }
        if(creep.room.name == homeRoom){
            targets = creep.room.find(FIND_STRUCTURES,{
               filter: function(targets){ 
                   return targets.structureType == STRUCTURE_CONTAINER 
                   && targets.store[RESOURCE_ENERGY] > creep.carryCapacity 
                   && targets.pos.findInRange(FIND_SOURCES, 2).length > 0 } 
            });
            if(targets.length){
                target = creep.pos.findClosestByRange(targets);
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
        }
    }else {
        if(creep.room.name != targetRoom){
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(targetRoom)));
        }
        if(creep.room.name == targetRoom){
            if(creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49){
                creep.moveTo(nextStepIntoRoom(creep.pos, creep.memory.targetRoom));
            }
            var target = creep.room.controller;
            if(ERR_NOT_IN_RANGE == creep.upgradeController(target)){
                creep.moveTo(target);
            }
        }
    }
}

function nextStepIntoRoom(pos, roomName){
    var x = pos.x;
    var y = pos.y;
    if(x == 0){ x = 1; }
    if(x == 49){ x = 48; }
    if(y == 0){ y = 1; }
    if(y == 49){ y = 48; }
    return new RoomPosition(x, y, roomName);
}
    
module.exports = {
    setHelpers: setHelpers,
    run: run
}