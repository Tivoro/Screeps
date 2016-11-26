//require("expansion.outpost").createOutpost("",1,0)
function createOutpost(roomName, miners, builders){
    Memory.outposts[roomName] = {
        "miners": {
            "count": miners,
            "parts": [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            "targetRoom": roomName,
        },
        "builders": {
            "count": builders,
            "parts": [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            "targetRoom": roomName
        }
    };
}
function run(){
    var outposts = Memory.outposts;
    for(var roomName in outposts){
        var outpostData = outposts[roomName];
        var miners = _(Game.creeps).filter({ memory: { role: 'outpostMiner'}}).value();
        var builders = _(Game.creeps).filter({ memory: { role: 'outpostBuilder'}}).value();
        if(miners.length < outpostData.miners.count){
            var home = Game.spawns['Spawn1'].room.name;
            Game.spawns['Spawn1'].createCreep(outpostData.miners.parts, undefined, {role: "outpostMiner", targetRoom: roomName, homeRoom: home});
        }
        if(builders.length < outpostData.builders.count){
            Game.spawns['Spawn1'].createCreep(outpostData.builders.parts, undefined, {role: "outpostBuilder", targetRoom: roomName, homeRoom: home});
        }
    }
    for(var cName in Game.creeps){
        var creep = Game.creeps[cName];
        if(creep.memory.role == "outpostMiner"){
            outpostMiner(creep);
        }
        if(creep.memory.role == "outpostBuilder"){
            runUpgrader(creep);
        }
    }
}
function outpostMiner(creep){
    var targetRoom = creep.memory.targetRoom;
    var homeRoom = creep.memory.homeRoom;
    if(creep.memory.state == undefined){ creep.memory.state = "harvest" }
    if(creep.memory.state == "deposit" && creep.carry.energy == 0){
        creep.memory.state = "harvest";
    }
    if(creep.memory.state == "harvest" && creep.carry.energy == creep.carryCapacity){
        creep.memory.state = "deposit";
    }
    
    if(creep.memory.state == "harvest"){
        if(creep.room.name != targetRoom){
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(targetRoom)));
        }
        if(creep.room.name == targetRoom){
            var target = creep.pos.findClosestByPath(FIND_SOURCES);
            if(target){
                if(ERR_NOT_IN_RANGE == creep.harvest(target)){
                    creep.moveTo(target);
                }
            }
        }
    } else {
        if(creep.room.name != homeRoom){
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(homeRoom)));
        }
        if(creep.room.name == homeRoom){
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                   filter: function(targets){ 
                        return targets.structureType == STRUCTURE_STORAGE
                    } 
                });
            if(target){
                if(ERR_NOT_IN_RANGE == creep.transfer(target, RESOURCE_ENERGY)){
                    creep.moveTo(target);
                }
            }
        }
    }
}
function outpostBuilder(creep){
    
}

module.exports = {
    createOutpost: createOutpost,
    run: run
}