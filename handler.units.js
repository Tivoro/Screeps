var unitBuilder = {
    run: function(spawn){
        for(var cName in Memory.creeps)
        {
            if(!Game.creeps[cName]){
                delete Memory.creeps[cName];
                console.log("Removing dead creep: " + cName);
            }
        }
        var currRoom = Game.spawns[spawn].room;
        var mem = currRoom.memory;
        var roomCreeps = currRoom.find(FIND_MY_CREEPS);
        var harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(roomCreeps, (creep) => creep.memory.role == 'builder');
        var constructors = _.filter(roomCreeps, (creep) => creep.memory.role == 'constructor');
        var trucks = _.filter(roomCreeps, (creep) => creep.memory.role == 'trucker');
        var storTrucks = _.filter(roomCreeps, (creep) => creep.memory.role == 'storTrucker');
        var logTrucks = _.filter(roomCreeps, (creep) => creep.memory.role == 'logTrucker');
        if(harvesters.length < mem.harvesters.count){
            Game.spawns[spawn].createCreep(mem.harvesters.parts, undefined, {role: "harvester"});
        }
        if(trucks.length < mem.truckers.count){
            Game.spawns[spawn].createCreep(mem.truckers.parts, undefined, {role: "trucker"});
        }
        if(storTrucks.length < mem.storTruckers.count){
            Game.spawns[spawn].createCreep(mem.storTruckers.parts, undefined, {role: "storTrucker"});
        }
        if(logTrucks.length < mem.logTruckers.count){
            Game.spawns[spawn].createCreep(mem.logTruckers.parts, undefined, {role: "logTrucker"});
        }
        if((trucks.length >= mem.truckers.count || (storTrucks.length >= mem.storTrucks.count && logTrucks.length >= mem.logTrucks.count)) && harvesters.length >= mem.harvesters.count){
            if(builders.length < mem.builders.count){
                Game.spawns[spawn].createCreep(mem.builders.parts, undefined, {role: "builder"});
            }
            if(constructors.length < mem.constructors.count){
                Game.spawns[spawn].createCreep(mem.constructors.parts, undefined, {role: "constructor"});
            }
        }
    }
}

module.exports = unitBuilder;